# Social Unifier 

## Social Unifier vous permet de gérer plusieurs réseaux sociaux en même temps.

Vous pouvez, pendant la durée de la beta, utilisez librement notre service en créant un compte.

Une fois votre compte créé, il faudra vous connectez aux services proposer depuis la page "Mon compte", enfin vous pourrez essayer de publier un post depuis la catégorie créée à cet effet.

Une fois votre post publié, vous aurez la possibilité d'avoir les liens de chacun de vos posts sur les réseaux sélectionnés.

Cette application a été developpée par des étudiants de la Coding Factory de Cergy en 1ère année.

Les technologies utilisées sont :

- Next.js en Typescript pour le front et le back
- Le framework TailwindCSS
- SQLite comme BDD
- Les ~~*merveilleuses* 🙄~~ API de Mastodon, Tumblr et Reddit

**Bon essai et joyeux codage !**

***The Social Unifier Team***

## Utilisation en locale

### Compte requis
Pour essayer **Social Unifier** sur votre propre machine, il vous faut d'abbort vous créér des application sur les réseaux sociaux concerné.
* reddit: https://www.reddit.com/prefs/apps
* Mastodon: https://docs.joinmastodon.org/client/token/#app
* Tumblr: https://www.tumblr.com/oauth/apps

L'API de reddit ne supporte officiellement que les posts de type text ou lien, donc pour poster des images sur ce dernier, il vous faudra également un compte [Cloudinary](https://cloudinary.com/).

### Installation
Ensuite, vous pouvez cloner le github avec
```
git clone https://github.com/Ly-sAn/socialunifier.git
cd socialunifier
```
Il vous faut créé a l'intérieur un fichier `.env.local` dans lequel rensoigné les information d'autentification des comptes que vous venez de creer:
```ini
#.env.local

AUTH_SECRET="random string d'au moins 32 charactères"

REDDIT_ID=
REDDIT_SECRET=

MASTODON_ID=
MASTODON_SECRET=

TUMBLR_CONSUMER_KEY=
TUMBLR_SECRET_KEY=

DIASPORA_ID=
DIASPORA_SECRET=

CLOUDINARY_ID=
CLOUDINARY_SECRET=
CLOUDINARY_NAME=
```

Il ne vous reste plus qu'a compiler et demarrer le projet.
```bash
npm install # télécharge toutes les dépendances
npm run build # compile le projet
npm start # démarre le projet

# ou 'npm run dev'
```

Une fois lancé, l'application créera automatiquement une base de donnée (`base.db`) contenant toutes les colonnes nécessaires.
Il ne vous reste plus qu'a vous rendre sur http://localhost:3000.
