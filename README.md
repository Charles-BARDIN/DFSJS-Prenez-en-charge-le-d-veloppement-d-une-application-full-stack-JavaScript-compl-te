# MDD — Monde de Dév

Réseau social pour développeurs : s'abonner à des thèmes, publier des articles
et les commenter. Application **full-stack Next.js (App Router)**.

La documentation complète du projet (architecture, choix techniques, tests,
revue technique, performance) se trouve dans [`DOCUMENTATION.md`](./DOCUMENTATION.md).

## Stack technique

- **Next.js 16** (App Router, Server Components, Server Actions) — **React 19**
- **TypeScript**
- **Prisma ORM** + **PostgreSQL**
- **Auth.js v5** (Credentials, session JWT)
- **Zod** (validation), **bcryptjs** (hachage des mots de passe)
- **Tailwind CSS 4** + composants **shadcn/ui**
- Tests : **Vitest** + **Testing Library** (unitaires / intégration), **Playwright** (e2e)

## Prérequis

- **Node.js 22 LTS**
- **PostgreSQL** (une instance pour le développement, une autre pour les tests e2e)

## Installation

```bash
git clone <repository-url>
cd P5-DFSJS
npm install
```

### Base de données (Docker)

```bash
# Base de développement (port 5434)
docker run --name mdd-postgres -e POSTGRES_USER=user -e POSTGRES_PASSWORD=password \
  -e POSTGRES_DB=mdd_db -p 5434:5432 -d postgres:16

# Base de test e2e, isolée (port 5435)
docker run --name mdd-postgres-test -e POSTGRES_USER=user -e POSTGRES_PASSWORD=password \
  -e POSTGRES_DB=mdd_test -p 5435:5432 -d postgres:16
```

Arrêter / relancer un conteneur :

```bash
docker stop mdd-postgres
docker start mdd-postgres
```

### Configuration

Copier le fichier d'exemple, puis renseigner les valeurs :

```bash
cp .env.example .env
```

`.env` (base de développement) :

```dotenv
DATABASE_URL="postgresql://user:password@localhost:5434/mdd_db?schema=public"
AUTH_SECRET="<valeur générée>"   # générer avec : npx auth secret
AUTH_URL="http://localhost:3000"
```

Pour les tests end-to-end, créer un `.env.test` pointant vers la base de test
**isolée** (port 5435), afin de ne jamais toucher la base de développement :

```dotenv
DATABASE_URL="postgresql://user:password@localhost:5435/mdd_test?schema=public"
AUTH_SECRET="test-secret-not-for-production"
AUTH_URL="http://localhost:3100"
```

> Les fichiers `.env` et `.env.test` ne sont pas versionnés.

### Migrations et seed

```bash
npm run db:migrate   # applique les migrations Prisma
npm run db:seed      # insère les thèmes et des contenus de démonstration
```

## Lancement

```bash
npm run dev
```

L'application est accessible sur [http://localhost:3000](http://localhost:3000).

### Compte de démonstration

Après le seed, un compte est disponible (connexion par e-mail **ou** nom d'utilisateur) :

- **Identifiant :** `marie_dev` (ou `marie.dev@mdd.local`)
- **Mot de passe :** `Demo#1234`

## Scripts disponibles

| Script | Description |
| :---- | :---- |
| `npm run dev` | Serveur de développement |
| `npm run build` | Build de production |
| `npm run start` | Démarre le build de production |
| `npm run lint` | Analyse ESLint |
| `npm test` | Tests unitaires / d'intégration (Vitest) |
| `npm run test:watch` | Vitest en mode watch |
| `npm run test:coverage` | Couverture de la logique métier |
| `npm run test:e2e` | Tests end-to-end (Playwright) |
| `npm run db:migrate` | Applique les migrations Prisma |
| `npm run db:seed` | Insère les données de démonstration |
| `npm run db:reset` | Réinitialise la base (migrations + seed) |

## Tests

```bash
npm test             # unitaires / intégration
npm run test:e2e     # end-to-end (base de test 5435, réinitialisée avant exécution)
```

Les tests end-to-end démarrent l'application sur le port 3100 et utilisent la
base de test dédiée ; ils n'affectent pas la base de développement.

## Server Actions & API

L'application n'expose pas d'API REST : la logique métier passe par des **Server
Actions** Next.js (validation Zod + contrôle de session avant toute opération).
Le seul Route Handler est celui d'Auth.js. Détail des choix en
[`DOCUMENTATION.md` § 2.3](./DOCUMENTATION.md).

**Mutations** (`'use server'`)

| Action | Fichier | Description |
| :---- | :---- | :---- |
| `registerUser` | `features/auth/actions.ts` | Inscription (e-mail, nom d'utilisateur, mot de passe) puis connexion |
| `login` / `logout` | `features/auth/actions.ts` | Connexion (e-mail **ou** nom d'utilisateur) / déconnexion |
| `updateProfile` | `features/profile/actions.ts` | Modifier e-mail / nom d'utilisateur / mot de passe |
| `subscribe` / `unsubscribe` | `features/themes/actions.ts` | S'abonner / se désabonner à un thème |
| `createArticle` | `features/articles/actions.ts` | Créer un article (auteur et date automatiques) |
| `addComment` | `features/comments/actions.ts` | Commenter un article (auteur et date automatiques) |

**Lectures** (queries)

| Query | Fichier | Description |
| :---- | :---- | :---- |
| `getFeed` | `features/articles/queries.ts` | Fil des articles des thèmes suivis, trié (récent / ancien) |
| `getArticle` | `features/articles/queries.ts` | Détail d'un article + commentaires |
| `getTopicsWithSubscription` / `getTopicList` | `features/themes/queries.ts` | Thèmes (avec état d'abonnement) / liste légère |
| `getProfile` | `features/profile/queries.ts` | Profil de l'utilisateur + abonnements |
| `getCurrentUser` / `requireUser` | `features/auth/current-user.ts` | Utilisateur courant / garde de page protégée |

**Route Handler**

| Endpoint | Fichier | Description |
| :---- | :---- | :---- |
| `GET` / `POST /api/auth/[...nextauth]` | `app/api/auth/[...nextauth]/route.ts` | Endpoints internes d'Auth.js (imposés par la librairie) |

## Structure du projet

```
app/          routes (App Router), pages et Route Handler Auth.js
components/    composants UI réutilisables (shadcn/ui possédés)
features/     logique par domaine (auth, themes, articles, comments, profile, layout)
lib/          utilitaires transverses (client Prisma, validations Zod, helpers)
prisma/       schema.prisma, migrations, seed
e2e/          tests Playwright
auth.ts, auth.config.ts, proxy.ts   configuration Auth.js et protection des routes
```
