import type sqlite3 from 'sqlite3'

type DatabaseColumn = {
    name: string,
    type: 'INTEGER' | 'TEXT' | 'REAL' | 'BLOB' | 'NUMERIC',
    notNull?: boolean,
    unique?: boolean,
    default?: number | string,
    check?: string,
    foreignKey?: ForeignKey,
    primary?: true,
    autoIncrement?: boolean,
}

type ForeignKey = {
    table: string,
    column: string
}

type Database = {
    tables: Array<{
        name: string,
        columns: Array<DatabaseColumn>,
    }>
}

const literal = (value: string | number) => typeof value === 'string' ? `'${value}'` : value?.toString();

const columnTemplate = (column: DatabaseColumn) =>
    `"${column.name}" ${column.type} ${maybe('NOT NULL', column.notNull)} ${maybe('DEFAULT ' + literal(column.default), column.default !== undefined)} ${maybe(`CHECK(${column.check})`, column.check)} ${maybe('UNIQUE', column.unique)}`;

const foreignKeyTemplate = (column: DatabaseColumn) =>
    `FOREIGN KEY ("${column.name}") REFERENCES "${column.foreignKey.table}"("${column.foreignKey.column}")`;

const maybe = (str: string, condition: any) => condition ? str : ''

function dbAllAsync(db: sqlite3.Database, sql: string) {
    return new Promise<Array<any>>((resolve, reject) => {
        db.all(sql, (err, rows) => {
            if (err)
                reject(err)
            else
                resolve(rows)
        });
    })
}

export async function modelDatabase(model: Database, db: sqlite3.Database) {

    db.serialize();
    for (const table of model.tables) {

        const primaryColumns = table.columns.filter(c => c.primary);
        const columnsDeclarations = table.columns.map(columnTemplate);

        const primaryDeclaration = `PRIMARY KEY (${primaryColumns.map(pc => `"${pc.name}"${maybe(" AUTOINCREMENT", pc.autoIncrement)}`).join(',')})`;

        const foreignKeyDeclarations = primaryColumns.filter(pc => pc.foreignKey).map(foreignKeyTemplate);

        const statement = `
                CREATE TABLE IF NOT EXISTS "${table.name}" (
                    ${[].concat(columnsDeclarations, [primaryDeclaration], foreignKeyDeclarations).join(',\n')}
                );
            `;
        db.run(statement);

        const existingColumns = await dbAllAsync(db, `PRAGMA table_info(${table.name})`);
        for (const column of table.columns) {
            if (!existingColumns.some(c => c.name === column.name)) {
                if (column.unique) {
                    console.log(`${table.name}.${column.name}: Impossible d'ajouter un colonne avec un contrainte UNIQUE (pour l'instant)`);
                    column.unique = false;
                }
                const statement = `
                    ALTER TABLE "${table.name}"
                        ADD ${columnTemplate(column)}
                `
                db.run(statement)
            }
        }

    }
    db.parallelize();
}
