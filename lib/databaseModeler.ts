import { Database } from 'sqlite';

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

type DatabaseModel = {
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

const maybe = (str: string, condition: any) => condition ? str : '';


export async function modelDatabase(model: DatabaseModel, db: Database) {

    db.getDatabaseInstance().serialize();
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
        await db.run(statement);

        const existingColumns = await db.all(`PRAGMA table_info(${table.name})`);
        
        for (const column of table.columns) {
            if (!existingColumns.some(c => c.name === column.name)) {
                if (column.unique) {
                    console.log(`${table.name}.${column.name}: Impossible d'ajouter une colonne avec une contrainte UNIQUE`);
                    column.unique = false;
                }
                if (column.notNull) {
                    console.log(`${table.name}.${column.name}: Impossible d'ajouter une colonne avec une contrainte NOT NULL`);
                    column.notNull = false;
                }
                const statement = `
                    ALTER TABLE "${table.name}"
                        ADD ${columnTemplate(column)}
                `
                await db.run(statement);
            }
        }

    }
    db.getDatabaseInstance().parallelize();
}
