Auteur : \[Nom et prénom de l'étudiant\]

Version : 0.0.1

Date : 29/05/2026

**Version 0.0.1**

# **Documentation et rapport du projet MDD**

## **Sommaire**

1. Présentation générale du projet
   1.1 Objectifs du projet
   1.2 Périmètre fonctionnel
2. Architecture et conception technique
   2.1 Schéma global de l'architecture
   2.2 Choix techniques
   2.3 API (Server Actions) et schémas de données
3. Tests, performance et qualité
   3.1 Stratégie de test
   3.2 Rapport de performance et optimisation
   3.3 Revue technique
4. Documentation utilisateur et supervision
   4.1 FAQ utilisateur
   4.2 Supervision et tâches déléguées à l'IA
5. **Annexes**

---

## **1\. Présentation générale du projet**

### **1.1 Objectifs du projet**

**But du projet.** MDD (Monde de Dév) est un réseau social destiné aux développeurs, édité par l'entreprise ORION. Il permet à ses membres de s'abonner à des thèmes du monde de la programmation, de publier des articles sur ces thèmes et d'échanger via des commentaires.

**Contexte et valeur ajoutée.** ORION souhaite mettre en relation les développeurs et favoriser le partage de connaissances et la collaboration entre pairs. À terme, MDD pourrait constituer un vivier de profils pour le recrutement. Avant un lancement grand public, l'entreprise valide le concept via une version **MVP** (Minimum Viable Product) déployée en interne ; les choix techniques retenus pour le MVP seront conservés pour les versions suivantes s'il atteint ses objectifs.

**Principales fonctionnalités.**

* Comptes utilisateurs et authentification sécurisée ;
* abonnement / désabonnement à des thèmes ;
* publication et consultation d'articles ;
* commentaires sur les articles ;
* fil d'actualité personnalisé (articles des thèmes suivis).

### **1.2 Périmètre fonctionnel**

Le périmètre du MVP est défini par les spécifications fonctionnelles. Il ne comprend **pas de back-office** (zone d'administration). Au terme de l'étape de tests, chaque fonctionnalité est implémentée, conforme aux maquettes, branchée sur l'authentification réelle (Auth.js) et couverte par des tests (unitaires et/ou end-to-end).

| Fonctionnalité | Description | Statut |
| :---- | :---- | :---- |
| Création de compte | Inscription par e-mail, nom d'utilisateur et mot de passe (validation Zod) | Terminée |
| Authentification | Connexion par e-mail **ou** nom d'utilisateur, session persistante, déconnexion (Auth.js / JWT) | Terminée |
| Gestion du profil | Consulter et modifier e-mail, nom d'utilisateur et mot de passe | Terminée |
| Abonnements | Lister les thèmes, s'abonner, se désabonner | Terminée |
| Publication d'articles | Créer un article (thème, titre, contenu) et le consulter | Terminée |
| Fil d'actualité | Articles des thèmes suivis, triables du plus récent au plus ancien et inversement | Terminée |
| Commentaires | Ajouter un commentaire à un article (non récursif) | Terminée |

---

## **2\. Architecture et conception technique**

### **2.1 Schéma global de l'architecture**

MDD est une application **full-stack Next.js (App Router)** : le même projet héberge le front-end (React) et la logique serveur. Les couches sont :

* **Client Components** (`'use client'`) : pages interactives et formulaires, exécutés dans le navigateur ;
* **Server Components** : rendu côté serveur des pages de lecture (fil, thèmes, profil), sans JavaScript inutile envoyé au client ;
* **Server Actions** (`'use server'`) : point d'entrée de la logique métier (« l'API »). Chaque action valide ses entrées avec **Zod** et vérifie la **session** avant toute opération ;
* **Auth.js v5** : authentification et session (JWT), protection des routes via le *proxy* Next.js (`proxy.ts`) ;
* **Prisma ORM → PostgreSQL** : accès aux données typé.

```mermaid
flowchart LR
    UI["Client Components<br/>(pages, formulaires)"]
    RSC["Server Components<br/>(lecture)"]
    SA["Server Actions<br/>(Zod + session)"]
    AUTH["Auth.js v5<br/>(session JWT)"]
    ORM["Prisma ORM"]
    DB[("PostgreSQL")]

    UI -->|"appel typé"| SA
    UI --> RSC
    RSC -->|"requêtes"| ORM
    SA -->|"requêtes"| ORM
    SA -.->|"contrôle session"| AUTH
    ORM --> DB
```

**Légende.** Les traits pleins représentent le flux de données principal (lecture via les Server Components, mutations via les Server Actions) ; le trait pointillé représente le contrôle d'authentification. La logique métier n'expose aucune API REST : les Server Actions tiennent ce rôle. Le seul Route Handler du projet est celui d'Auth.js (`/api/auth/[...nextauth]`), imposé par la librairie pour ses endpoints internes d'authentification (voir section 2.3).

**Organisation technique (feature-based).** Le code est regroupé par domaine métier plutôt que par type technique :

```
app/                 routes (App Router) et pages
features/            logique par domaine (auth, themes, articles, profile)
  <feature>/         composants, Server Actions et schémas Zod du domaine
lib/                 utilitaires transverses (client Prisma, helpers)
prisma/              schema.prisma, migrations, seed
```

#### Conformité aux contraintes : séparation back/front et sécurité

* **Séparation back/front : logique, pas physique.** La distinction n'est pas un déploiement séparé mais une frontière stricte serveur/client propre à Next.js : Server Components et Server Actions s'exécutent uniquement sur le serveur, les Client Components dans le navigateur. Le code back-end (accès BDD, secrets) n'est jamais envoyé au client.
* **« Une API permet l'interaction » : ce sont les Server Actions.** Elles constituent le point d'entrée typé par lequel le front sollicite le back — l'équivalent des endpoints d'une API REST, sans couche HTTP métier à écrire et maintenir. (Le seul Route Handler est celui d'Auth.js, dédié à l'authentification, pas à la logique métier.)
* **Interaction sécurisée.** Chaque Server Action est une frontière de confiance : validation Zod des entrées, contrôle de session (Auth.js) avant toute opération, secrets et connexion BDD jamais exposés au client. Les bonnes pratiques de sécurité Next.js (`nextjs.org/docs/security`) sont suivies.
* **SOLID / Clean Code.** Appliqués à l'implémentation (architecture feature-based, schémas Zod centralisés, format de retour homogène `ActionResult`) et vérifiés lors de la revue technique (section 3.3).

### **2.2 Choix techniques**

Les éléments **imposés** par les contraintes techniques ORION sont indiqués comme tels (non soumis à arbitrage). Les choix **décidés** font l'objet d'une analyse comparative détaillée au paragraphe « Alternatives & arbitrages ».

| Éléments choisis | Type | Lien documentation | Objectif du choix | Justification |
| :---- | :---- | :---- | :---- | :---- |
| **Next.js 16 (App Router)** | Framework full-stack | [docs](https://nextjs.org/docs) | Unifier front + back (Server Components, Server Actions) | **Imposé par ORION.** Une seule stack à opérer ; rendu serveur et logique métier sans API séparée. |
| **TypeScript 5** | Langage | [docs](https://www.typescriptlang.org/docs) | Typage statique de bout en bout | **Imposé par ORION.** Types partagés Prisma → Server Actions → UI, refactor sécurisé. |
| **Node.js 22 LTS** | Runtime | [docs](https://nodejs.org/docs) | Moteur d'exécution serveur | **Imposé par ORION.** |
| **Prisma ORM** | ORM / accès BDD | [docs](https://www.prisma.io/docs) | Accès BDD typé + migrations | **Imposé par ORION** (« Prisma plutôt que des requêtes SQL brutes »). |
| **PostgreSQL** | Base de données | [docs](https://www.postgresql.org/docs) | Stockage relationnel | **Décidé** — données fortement relationnelles + contrainte d'unicité (voir arbitrages). |
| **Server Actions** | Couche « API » | [docs](https://nextjs.org/docs/app/getting-started/updating-data) | Interaction front/back typée et sécurisée | **Décidé** — supprime la couche HTTP ; validation + session à la frontière (voir arbitrages). |
| **Auth.js v5 (NextAuth)** | Authentification | [docs](https://authjs.dev) | Sessions sécurisées | **Décidé** — Credentials + JWT, cookie persistant (voir arbitrages). |
| **Zod** | Validation / schémas | [docs](https://zod.dev) | Valider les entrées et inférer les types | **Décidé** — schéma = source de vérité, réutilisable front/back. |
| **bcryptjs** | Hachage mot de passe | [docs](https://www.npmjs.com/package/bcryptjs) | Stocker les mots de passe de façon sûre | **Décidé** — algorithme bcrypt en JavaScript pur, sans compilation native (voir arbitrages). |
| **Tailwind CSS 4 + shadcn/ui** | UI / styling | [docs](https://ui.shadcn.com) | Design system + responsive | **Conservé** (présent dans le starter) — composants possédés, accessibilité Radix (voir arbitrages). |
| **Vitest + Testing Library + Playwright** | Tests | [docs](https://vitest.dev) | Tests unitaires / composant / e2e | **Décidé** — Supertest écarté, pas d'API REST à tester (voir arbitrages). |
| **Architecture feature-based** | Organisation du code | — | Regrouper par domaine métier | **Décidé** — cohésion, faible couplage (voir arbitrages). |
| **Prisma Migrate** | Migrations BDD | [docs](https://www.prisma.io/docs/orm/prisma-migrate) | Migrations versionnées | **Décidé** — historique de schéma reproductible (voir arbitrages). |

#### Alternatives & arbitrages (choix décidés)

**Server Actions** *(vs Route Handlers REST, tRPC, GraphQL, API Express/NestJS séparée)*

* *Avantages :* aucune couche de transport à écrire (routes, contrôleurs, fetchers, sérialisation JSON, DTOs) — l'action s'appelle comme une fonction depuis le composant ; typage de bout en bout natif (les types TS traversent client→serveur sans génération de code, contrairement à REST ou GraphQL) ; intégration formulaire (`useActionState`, `<form action={...}>`) fonctionnant même sans JavaScript (progressive enhancement) ; revalidation de cache intégrée (`revalidatePath` / `revalidateTag`) après mutation ; validation Zod et contrôle de session concentrés au même endroit (`'use server'`).
* *Inconvénients :* couplage fort à Next.js (non réutilisable tel quel par un client tiers ou mobile sans ajouter une API) ; pas de surface HTTP documentable/testable avec des outils REST (Supertest, Postman) ; modèle récent avec des pièges (arguments sérialisés, actions exposées comme endpoints POST → toujours valider et vérifier l'autorisation).
* *Pourquoi ce choix :* pour un MVP interne à client unique (le front Next.js), une couche REST n'ajoute que du code et de la surface d'attaque. tRPC et GraphQL répondraient au besoin de typage mais introduisent une dépendance et un outillage disproportionnés à cette échelle ; une API séparée (Express/Nest) contredirait la stack unifiée imposée.

**React Server Components** *(vs tout en Client Components / SPA classique)*

* *Avantages :* le rendu et l'accès aux données se font côté serveur → moins de JavaScript envoyé au client, pas d'endpoint de lecture à exposer, secrets et connexion BDD jamais présents dans le navigateur, meilleur TTFB et SEO.
* *Inconvénients :* frontière client/serveur à maîtriser (un Server Component ne peut pas utiliser `useState`/`onClick`) ; risque de cascades de requêtes (« waterfalls ») si mal composé ; modèle mental nouveau.
* *Pourquoi ce choix :* les écrans de MDD sont surtout de la lecture (fil, thèmes, profil, détail d'article) → idéaux en RSC ; on isole l'interactif (formulaires, menu mobile, bouton « s'abonner ») en Client Components. Une SPA tout-client multiplierait les endpoints et le poids JS pour un faible bénéfice.

**PostgreSQL** *(vs MySQL, SQLite, MongoDB)*

* *Avantages :* relationnel robuste, MVCC avec verrouillage par ligne (nombreuses écritures concurrentes), typage strict, contraintes riches (FK, `UNIQUE`, `CHECK`, index partiels/fonctionnels), types avancés (UUID, `citext`, `enum`, JSONB), support Prisma le plus complet.
* *Inconvénients :* nécessite un serveur (Docker en local), un peu plus à opérer que SQLite.
* *Pourquoi ce choix :* **SQLite écarté** — verrou d'écriture au niveau de la base (un seul writer), FK désactivées par défaut et typage laxiste → inadapté à une application web multi-utilisateurs en production (il reste excellent pour l'embarqué/le prototypage). **MongoDB écarté** — données fortement relationnelles avec jointures (le fil = articles des thèmes suivis), un SGBD relationnel est plus naturel. **MySQL ferait aussi bien le travail** ; on tranche en faveur de Postgres pour sa rigueur (contraintes/typage), le contrôle explicite de l'unicité insensible à la casse pour l'e-mail et le nom d'utilisateur (`citext` ou index `lower()`) et son intégration dans l'écosystème Next.js/Prisma.
* *Note :* on garde **le même moteur en test et en production** (pas de SQLite pour les tests) afin d'éviter les écarts de comportement entre environnements (les fonctionnalités diffèrent, ex. les `enum` non supportés par SQLite avec Prisma).

**Auth.js v5 — Credentials + JWT** *(vs auth maison jose+cookies, Lucia, Clerk/Auth0, Supabase Auth, Better Auth)*

* *Avantages :* librairie auditée qui gère les points sensibles (signature et rotation des tokens, protection CSRF, cookies `httpOnly`/`secure`, callbacks), protection des routes via le *proxy*, intégration Next.js native.
* *Inconvénients :* API v5 récente et documentation Credentials moins fournie que pour les providers OAuth ; comportement « boîte noire » à comprendre pour le défendre ; révocation de session moins immédiate qu'avec des sessions en base (un JWT reste valide jusqu'à son expiration).
* *Pourquoi ce choix :* on ne réimplémente pas soi-même la sécurité (source d'erreurs). La stratégie **JWT** (cookie signé) assure la persistance entre sessions **sans table ni store serveur** → modèle et infrastructure allégés, cohérent avec la consigne « ne pas surcomplexifier la sécurité ». Le provider **Credentials** correspond au besoin (e-mail/nom d'utilisateur + mot de passe, pas d'OAuth tiers). Les solutions SaaS (Clerk, Auth0) sont écartées (dépendance externe et données utilisateurs hors de notre base pour un simple MVP interne) ; une auth maison ou Lucia donnerait plus de contrôle mais beaucoup plus de code de sécurité à écrire et à défendre.
* *Note :* pour la révocation, on peut maintenir des durées de session courtes ; passer à des sessions en base reste une évolution possible si une révocation immédiate devient nécessaire.

**Zod** *(vs Yup, Joi, class-validator + DTOs, validation manuelle)*

* *Avantages :* un schéma valide à l'exécution **et** infère le type TypeScript (`z.infer`) → une seule source de vérité ; réutilisable côté client (retour de formulaire) et serveur (frontière de confiance des Server Actions) ; erreurs structurées (`fieldErrors`) ; composition (`.refine`, `.merge`).
* *Inconvénients :* validation au runtime (coût négligeable ici), schémas parfois verbeux, dépendance supplémentaire.
* *Pourquoi ce choix :* élimine la double déclaration « type + validateur » (Yup/Joi ne fournissent pas le type ; class-validator impose des classes/DTOs et des décorateurs). Centralise les règles métier (mot de passe ≥ 8 caractères avec chiffre/minuscule/majuscule/spécial, formats e-mail et nom d'utilisateur). Déjà présent dans le starter et reconnu dans l'écosystème comme remplaçant des DTOs.

**bcryptjs** *(vs bcrypt natif, argon2, scrypt)*

* *Avantages :* algorithme bcrypt (dérivation lente, sel intégré, facteur de coût ajustable → résiste au brute-force) en **JavaScript pur**, donc **aucune compilation native** (`node-gyp`) → installation fiable sur tout environnement, compatible avec les tests (Vitest) et le edge runtime ; API simple (`hash` / `compare`).
* *Inconvénients :* légèrement plus lent que l'implémentation native `bcrypt` ; argon2id est aujourd'hui le premier choix recommandé par l'OWASP (résistance « mémoire-hard ») ; bcrypt tronque au-delà de 72 octets.
* *Pourquoi ce choix :* le paquet natif `bcrypt` impose une compilation native parfois capricieuse selon la machine ; `bcryptjs` offre le même algorithme sans cette contrainte, ce qui simplifie l'installation et les tests pour un MVP. argon2 est documenté comme axe d'amélioration. (Règle non négociable : jamais de mot de passe en clair ni de hash rapide type SHA-256.)

**Tailwind CSS 4 + shadcn/ui** *(conservé du starter — vs CSS Modules, MUI, Chakra UI, styled-components)*

* *Avantages :* shadcn fournit des composants **copiés dans le repo** (code possédé et adaptable, pas de dépendance UI fermée) bâtis sur Radix → accessibilité clavier/ARIA native (sert l'exigence d'accessibilité) ; Tailwind permet une itération rapide et un responsive utilitaire (breakpoints) cohérent avec l'exigence multi-supports ; pas de CSS-in-JS au runtime.
* *Inconvénients :* HTML chargé en classes utilitaires (lisibilité) ; composants shadcn à maintenir soi-même (pas de mise à jour via npm) ; courbe d'apprentissage Tailwind.
* *Pourquoi ce choix :* déjà configuré dans le starter (thème violet posé) → cohérent à conserver et accélère l'intégration des maquettes Figma. MUI/Chakra imposeraient leur propre design system (moins fidèle aux maquettes) et un poids runtime ; styled-components ajoute du CSS-in-JS runtime peu adapté aux Server Components.

**Vitest + Testing Library + Playwright** *(vs Jest, Cypress ; Supertest exclu)*

* *Avantages :* Vitest réutilise la chaîne Vite/ESM/TS du projet (configuration quasi nulle, démarrage rapide, mode watch) ; React Testing Library teste les composants au plus près de l'usage (DOM, accessibilité) ; Playwright couvre l'e2e multi-navigateurs de façon fiable (auto-wait) sur les parcours critiques.
* *Inconvénients :* tests e2e plus lents et plus fragiles à maintenir ; trois outils à configurer.
* *Pourquoi ce choix :* couvre les trois niveaux attendus (unitaire, intégration, e2e). Jest est écarté car Vitest s'intègre mieux à un projet Vite/ESM. **Supertest est exclu techniquement** : il teste des endpoints HTTP, absents ici puisque les Server Actions n'exposent pas d'API REST → on teste les Server Actions directement en intégration (Vitest, en appelant la fonction sur une base de test) et les parcours via Playwright (qui exerce de fait la chaîne HTTP du navigateur).

**Architecture feature-based** *(vs layer-based par type technique, atomic design)*

* *Avantages :* co-localise tout ce qui concerne un domaine (UI + Server Actions + schémas Zod + types) → modifications localisées, faible couplage entre features, évolution par simple ajout d'un dossier ; onboarding plus simple (un dossier = une fonctionnalité).
* *Inconvénients :* quelques duplications possibles (helpers partagés à factoriser dans `lib`) ; conventions de découpage à tenir ; frontière feature/partagé parfois floue.
* *Pourquoi ce choix :* MDD se décompose naturellement en domaines (auth, themes, articles, profile). Le layer-based disperse une même fonctionnalité dans plusieurs dossiers techniques (on saute de `components/` à `services/`…). L'App Router impose déjà l'arborescence des routes dans `app/` ; on garde la logique métier regroupée dans `features/`.

**Prisma Migrate** *(vs `prisma db push`, migrations SQL manuelles)*

* *Avantages :* génère des fichiers de migration SQL **versionnés dans Git** → historique de schéma reproductible, déployable de façon déterministe (CI/production), revue de schéma possible en pull request.
* *Inconvénients :* un peu plus de cérémonie en développement (générer puis appliquer) ; conflits de migrations à gérer en équipe.
* *Pourquoi ce choix :* la base doit être cohérente et reproductible (étape 3 et production) ; `db push` convient au prototypage rapide mais ne laisse aucune trace → on retient Migrate pour un schéma traçable et déployable.

### **2.3 API (Server Actions) et schémas de données**

> Cette section décrit les Server Actions telles qu'**implémentées**. Le tableau en donne une vue fonctionnelle ; les signatures exactes figurent dans le code des features (`features/<domaine>/actions.ts` et `queries.ts`).

La logique métier est exposée via des **Server Actions**. Le projet ne comporte qu'**un seul Route Handler**, celui d'Auth.js (`app/api/auth/[...nextauth]/route.ts`, méthodes `GET` et `POST`) : il est **imposé par la librairie** pour ses endpoints internes (connexion, déconnexion, `callback`, `csrf`, `session`, `providers`) et ne contient aucune logique métier. Convention de retour homogène pour les mutations : `ActionResult<T> = { success: true; data: T } | { success: false; error: string; fieldErrors?: Record<string, string> }`.

| Server Action | Type | Description | Retour / Réponse |
| :---- | :---- | :---- | :---- |
| `registerUser` | Mutation | Créer un compte (e-mail, nom d'utilisateur, mot de passe validé Zod et haché) puis connecter l'utilisateur | `ActionResult` |
| `login` / `logout` | Mutation | Connexion (e-mail **ou** nom d'utilisateur) / déconnexion (s'appuient sur `signIn` / `signOut` d'Auth.js) | `ActionResult` / redirection |
| `getProfile` | Query | Profil de l'utilisateur connecté + abonnements | `User` (sans mot de passe) + abonnements |
| `updateProfile` | Mutation | Modifier e-mail / nom d'utilisateur / mot de passe | `ActionResult` |
| `getTopicsWithSubscription` | Query | Liste de tous les thèmes + état d'abonnement de l'utilisateur | `Topic[]` (avec `isSubscribed`) |
| `subscribe` / `unsubscribe` | Mutation | S'abonner / se désabonner à un thème | `ActionResult` |
| `getFeed` | Query | Fil des articles des abonnements, trié (récent / ancien) | `Article[]` |
| `getArticle` | Query | Détail d'un article + commentaires | `Article & { comments }` |
| `createArticle` | Mutation | Créer un article (thème, titre, contenu ; auteur + date automatiques) | Redirige vers l'article créé |
| `addComment` | Mutation | Ajouter un commentaire (contenu ; auteur + date automatiques) | `ActionResult` |

**Modèle de données (Prisma).**

```mermaid
erDiagram
    USER ||--o{ ARTICLE : "écrit"
    USER ||--o{ COMMENT : "rédige"
    USER ||--o{ SUBSCRIPTION : "souscrit"
    TOPIC ||--o{ ARTICLE : "regroupe"
    TOPIC ||--o{ SUBSCRIPTION : "ciblé par"
    ARTICLE ||--o{ COMMENT : "reçoit"

    USER {
        string id PK
        string email UK
        string username UK
        string password
        datetime createdAt
        datetime updatedAt
    }
    TOPIC {
        string id PK
        string title
        string description
        datetime createdAt
    }
    SUBSCRIPTION {
        string id PK
        string userId FK
        string topicId FK
        datetime createdAt
    }
    ARTICLE {
        string id PK
        string title
        string content
        string authorId FK
        string topicId FK
        datetime createdAt
    }
    COMMENT {
        string id PK
        string content
        string authorId FK
        string articleId FK
        datetime createdAt
    }
```

Remarques :

* Pas de tables `Account` / `Session` : la stratégie **JWT** d'Auth.js stocke la session dans un cookie signé (pas d'adapter Prisma requis).
* `Subscription` porte une contrainte d'unicité `@@unique([userId, topicId])` (un seul abonnement par couple utilisateur/thème).
* Les thèmes (`Topic`) n'ayant pas de back-office, ils sont insérés via un **script de seed**.
* Suppressions en cascade en place via `onDelete: Cascade` (ex. supprimer un article supprime ses commentaires).

---

## **3\. Tests, performance et qualité**

### **3.1 Stratégie de test**

La stratégie repose sur **deux niveaux complémentaires**, chacun ciblant ce qu'il vérifie le mieux :

* **Tests unitaires / d'intégration (Vitest + React Testing Library).** Ils ciblent la **logique métier** isolément : Server Actions de mutation, schémas de validation Zod, autorisation, transformation des données et helpers, ainsi que quelques composants Client au plus près de l'usage (DOM, accessibilité). L'accès à la base est **simulé** (mock Prisma via `vitest-mock-extended`) pour des tests rapides et déterministes, sans dépendance externe.
* **Tests end-to-end (Playwright).** Ils exercent les **parcours utilisateur réels** dans un navigateur (Chromium), de l'interface jusqu'à la base de données, sur une **base de test isolée** (conteneur PostgreSQL dédié, distinct de la base de développement) **réinitialisée avant chaque exécution** (`prisma migrate reset` + seed). C'est ce niveau qui valide concrètement la chaîne front → Server Action → Prisma → PostgreSQL.

**Pourquoi ce découpage.** Les Server Actions n'exposant pas d'API REST, il n'y a pas d'endpoint HTTP à tester avec un outil type Supertest (cf. arbitrage § 2.2) : on teste donc la logique métier directement en unitaire, et la chaîne HTTP réelle via Playwright. Le périmètre de **couverture** est volontairement **concentré sur la logique métier** (et non sur les pages ou le code d'authentification, couverts par l'e2e), afin de mesurer ce qui a une réelle valeur de non-régression plutôt qu'un pourcentage global artificiel.

**Commandes.** `npm test` (unitaires), `npm run test:coverage` (couverture), `npm run test:e2e` (end-to-end).

| Type de test | Outil / framework | Portée | Résultats |
| :---- | :---- | :---- | :---- |
| Test unitaire / intégration | Vitest (+ mock Prisma) | Server Actions, validations Zod, autorisation, helpers | **62 tests** sur 11 fichiers — ✅ tous passants |
| Test de composant | React Testing Library | Composants Client (carte d'article, formulaire de commentaire) | Inclus dans les 62 tests — ✅ |
| Test e2e | Playwright (Chromium) | Inscription, connexion/déconnexion, refus de connexion, protection des routes, abonnement à un thème, création + consultation d'un article avec commentaire | **6 scénarios** — ✅ tous passants |

> **Couverture (logique métier).** Seuils exigés via `vitest.config.ts` : statements ≥ 85 %, branches ≥ 80 %, functions ≥ 85 %, lines ≥ 85 %. Le rapport HTML est généré par `npm run test:coverage` (voir annexes, § 5).

### **3.2 Rapport de performance et optimisation**

#### Optimisations intégrées dès la conception

La performance n'a pas fait l'objet d'une correction *a posteriori* : les choix d'architecture limitent par construction le JavaScript envoyé au client et le coût des requêtes.

* **Rendu serveur par défaut (React Server Components).** Les écrans de lecture (fil, thèmes, profil, détail d'article) sont des Server Components : le HTML est rendu côté serveur et **aucun JavaScript de composant n'est envoyé** pour ces pages. Seuls les éléments interactifs sont des Client Components (8 fichiers `'use client'` : formulaires, menu mobile, navigation), ce qui réduit la taille du bundle hydraté.
* **Pas de couche API REST.** Les Server Actions remplacent les endpoints HTTP : pas de fetchers ni de sérialisation côté client à charger, et les données de lecture sont obtenues directement pendant le rendu serveur (pas de cascade de requêtes réseau au montage).
* **Police optimisée (`next/font`).** La police Inter est auto-hébergée via `next/font/google` : pas de requête vers Google Fonts, fichiers servis depuis l'origine et **sans décalage de mise en page** (CLS) grâce au `font-display` géré par Next.
* **Images optimisées (`next/image`).** Le logo et les visuels (pages d'accueil et d'authentification) passent par `next/image` (formats modernes, dimensionnement, *lazy loading*) → pas d'images surdimensionnées qui pénaliseraient le LCP.
* **Index de base de données.** Les requêtes fréquentes sont indexées dans le schéma Prisma : `@@index([createdAt])` (tri chronologique du fil), `@@index([topicId])` (filtrage par thème), `@@index([articleId])` (commentaires d'un article), plus les contraintes `@unique` (e-mail, nom d'utilisateur, titre de thème) et `@@unique([userId, topicId])` (abonnements). Le tri et le filtrage ne provoquent donc pas de parcours de table complet.
* **Build de production.** L'audit ci-dessous est réalisé sur un build de production (`next build` + `next start`), seul représentatif des performances réelles (le mode développement n'est pas optimisé).

#### Résultats de l'audit Lighthouse

Audit réalisé avec **Lighthouse 13.0.2** (DevTools Chrome) sur le build de production (`next build` + `next start`), profil **Desktop**, sur deux pages représentatives nécessitant une session : le fil d'actualité (page d'accueil `/`) et la liste des thèmes (`/themes`).

| Catégorie | Accueil `/` (fil) | `/themes` |
| :---- | :----: | :----: |
| Performance | 100 | 100 |
| Accessibilité | 100 | 100 |
| Bonnes pratiques | 96 | 96 |
| SEO | 100 | 100 |

Les deux pages obtiennent **100/100 en Performance, Accessibilité et SEO**, et **96/100 en Bonnes pratiques**. Ces résultats valident les choix d'optimisation décrits ci-dessus : rendu serveur limitant le JavaScript client, police et images optimisées (pas de décalage de mise en page ni de ressources bloquantes) et bonnes pratiques d'accessibilité (libellés ARIA, titres et descriptions des composants interactifs, contrastes). Les rapports complets sont joints en annexe (§ 5).

**Analyse du 96/100 en Bonnes pratiques.** Le seul point retiré provient de l'audit *« Issues were logged in the Issues panel in Chrome DevTools »*, dont l'unique entrée est de type **« Content Security Policy »** : l'application ne définit pas d'en-tête **CSP**, que Chrome signale comme protection recommandée contre les attaques XSS. C'est un **durcissement de sécurité supplémentaire**, distinct des protections déjà en place (cf. § 3.3) ; son absence n'introduit pas de faille mais prive d'une défense en profondeur côté navigateur. **Correctif possible :** définir un en-tête `Content-Security-Policy` (via `headers()` dans `next.config` ou le *proxy*), idéalement avec un *nonce* pour les scripts. Ce réglage n'a pas été activé dans le périmètre du MVP (il demande un paramétrage et des tests pour ne pas casser le chargement des ressources) et constitue un axe d'amélioration identifié.

> Procédure de reproduction : `npm run build` puis `npm run start`, se connecter, puis lancer Lighthouse (onglet *Lighthouse* des DevTools Chrome, ou `npx lighthouse <url>`) sur la page voulue.

#### Points de vigilance et axes d'amélioration

* **Pagination du fil** : actuellement tous les articles des thèmes suivis sont chargés ; une pagination (ou un défilement infini) sera nécessaire à mesure que le volume d'articles augmente.
* **Mise en cache des données partagées** : les pages personnalisées sont aujourd'hui rendues dynamiquement (lecture de session). Pour réduire les accès en base, les données **non personnalisées** (liste des thèmes, contenu des articles) pourraient être mises en cache avec revalidation, tout en gardant la partie par-utilisateur (abonnements, fil) dynamique. Tout cache manuel de données par-utilisateur devrait alors rester clé par `userId` (garde-fou de sécurité, cf. § 3.3).
* **En-tête Content-Security-Policy** : ajouter une CSP (idéalement avec *nonce*) constituerait un durcissement de sécurité côté navigateur ; c'est le seul point retiré par Lighthouse (cf. analyse ci-dessus), non activé dans le périmètre du MVP.
* **PPR / `next/dynamic`** : le *Partial Prerendering* et le découpage de code à la demande restent des optimisations possibles ; l'audit actuel (100/100) ne les rend pas nécessaires à ce stade, mais ils pourront être utiles si le volume de contenu et d'interactivité croît.

### **3.3 Revue technique**

Synthèse critique du code à l'issue du développement et des tests.

**Points forts**

* **Typage strict de bout en bout** : les types générés par Prisma sont propagés aux Server Actions puis à l'UI ; `tsc --noEmit` passe sans erreur.
* **Validation centralisée** : tous les schémas Zod sont regroupés dans `lib/validations.ts`, source de vérité unique réutilisée côté serveur (frontière des Server Actions) et côté client (retour d'erreurs des formulaires).
* **Frontières de confiance homogènes** : chaque Server Action de mutation vérifie la session (`getCurrentUser`) puis valide ses entrées (Zod) avant tout accès à la base, et renvoie un résultat uniforme `ActionResult` (`ok` / `fail`).
* **Sécurité en défense de profondeur** : la protection de routes (`proxy.ts`) n'est qu'une première barrière (présence d'un JWT valide) ; la protection réelle des données est rejouée à chaque opération par les Server Actions (Zod + `getCurrentUser`) et par les pages (`requireUser`). Même si cette première barrière était contournée, l'opération échouerait faute de session valide. La protection fonctionne en **liste blanche** : tout est protégé par défaut, seules `/`, `/login` et `/register` sont publiques → aucune nouvelle page ne peut être oubliée.
* **Données protégées** : mots de passe hachés (bcryptjs), messages d'erreur d'authentification génériques (ne divulguent pas l'existence d'un compte), secrets et connexion BDD jamais exposés au client (Server Components / Server Actions).
* **Cache multi-utilisateur maîtrisé** : les pages personnalisées (ex. `/themes` avec l'état d'abonnement) sont rendues dynamiquement car `auth()` lit la session → aucune fuite de données via le *Full Route Cache* ; règle retenue : tout cache manuel de données par-utilisateur doit être clé par `userId`.
* **Architecture lisible** : découpage *feature-based* (`features/<domaine>`) et séparation nette Server / Client Components (lecture en RSC, interactif isolé côté client).
* **Compatibilité runtime** : configuration Auth.js scindée (`auth.config.ts` compatible *edge* pour le *proxy* + `auth.ts` complet côté Node).
* **Testabilité** : la logique d'autorisation est extraite dans `features/auth/authorize.ts` pour être testée isolément ; couverture ciblée sur la logique métier complétée par des tests end-to-end sur les parcours.

**Points à améliorer / dette technique**

* **Hachage** : `bcryptjs` a été retenu pour éviter la compilation native ; argon2id est aujourd'hui recommandé par l'OWASP → axe d'amélioration.
* **Session JWT** : la révocation n'est pas immédiate (un token reste valide jusqu'à son expiration) → durées courtes, ou passage à des sessions en base si une révocation instantanée devient nécessaire.
* **Fil d'actualité sans pagination** : tous les articles des thèmes suivis sont chargés → à paginer si le volume augmente.
* **Périmètre de couverture** : concentré sur la logique métier ; les pages et les actions d'authentification ne sont pas testées unitairement (elles sont exercées en e2e) — choix assumé, à compléter au besoin.
* **Messages d'erreur serveur** volontairement génériques (pas de fuite d'information) : un mapping plus fin améliorerait le retour utilisateur.
* **Suppression définitive** : `onDelete: Cascade` évite les enregistrements orphelins, mais un *soft delete* (`deletedAt`) serait préférable en production pour conserver l'historique plutôt que de supprimer définitivement.
* **Secret d'authentification** : `AUTH_SECRET` est un placeholder de développement → à régénérer (`npx auth secret`) avant tout déploiement.
* **En-tête CSP absent** : seul point retiré par l'audit Lighthouse (cf. § 3.2) ; une *Content-Security-Policy* constituerait un durcissement supplémentaire.

**Actions correctives appliquées**

* **Centralisation des schémas Zod** dans `lib/validations.ts` (suppression des validations dispersées).
* **Extraction de `authorize`** hors d'`auth.ts` pour le rendre testable indépendamment de la configuration Auth.js.
* **Élagage du code mort** détecté par Knip (exports et dépendances inutilisés supprimés).
* **Abstraction `getCurrentUser` / `requireUser`** pour découpler les appelants de l'implémentation d'authentification.
* **Fermeture du menu mobile** déplacée dans un gestionnaire d'événement plutôt qu'un `useEffect` réagissant à l'URL, suite à la revue ESLint (`react-hooks/set-state-in-effect`).

---

## **4\. Documentation utilisateur et supervision**

### **4.1 FAQ utilisateur**

Aide destinée aux utilisateurs de MDD, au format **Question / Réponse**.

**Q : Comment créer un compte ?**

R : Cliquez sur « S'inscrire », renseignez votre adresse e-mail, un nom d'utilisateur et un mot de passe, puis validez. Vous êtes automatiquement connecté et redirigé vers la page d'accueil, qui affiche votre fil d'actualité.

**Q : Quelles sont les règles pour le mot de passe ?**

R : Il doit contenir au moins 8 caractères, dont au moins un chiffre, une minuscule, une majuscule et un caractère spécial.

**Q : Comment me connecter ?**

R : Sur la page « Se connecter », saisissez **votre e-mail ou votre nom d'utilisateur** (au choix) et votre mot de passe. Votre session reste active jusqu'à la déconnexion.

**Q : Mon fil d'actualité est vide, est-ce normal ?**

R : Oui, le fil (sur la page d'accueil) n'affiche que les articles des thèmes auxquels vous êtes abonné. Rendez-vous sur la page « Thèmes » pour vous abonner : des articles apparaîtront ensuite dans votre fil.

**Q : Comment m'abonner à un thème ?**

R : Depuis la page « Thèmes », cliquez sur « S'abonner » sur le thème souhaité. Le bouton affiche alors « Déjà abonné ».

**Q : Comment me désabonner d'un thème ?**

R : Le désabonnement se fait depuis votre **profil** : chaque thème suivi y est affiché avec un bouton pour s'en désabonner.

**Q : Comment publier un article ?**

R : Cliquez sur « Créer un article », choisissez un thème, saisissez un titre et le contenu, puis validez. L'article est publié à votre nom et visible par les personnes abonnées à ce thème.

**Q : Comment commenter un article ?**

R : Ouvrez l'article, écrivez votre commentaire dans le champ prévu en bas de page et envoyez-le. Il apparaît immédiatement sous l'article.

**Q : Comment modifier mon profil ?**

R : Accédez à votre profil (icône en forme d'avatar). Vous pouvez y mettre à jour votre e-mail, votre nom d'utilisateur et votre mot de passe.

**Q : Comment me déconnecter ?**

R : Utilisez le bouton « Se déconnecter » (dans l'en-tête sur ordinateur, ou en haut du menu sur mobile).

**Q : L'application ne se charge pas, que faire ?**

R : Rafraîchissez la page. Si le problème persiste, vérifiez votre connexion internet ou contactez le support technique.

### **4.2 Supervision et tâches déléguées à l'IA**

Conformément à la posture de supervision attendue, quelques tâches simples ont été confiées à l'IA, puis systématiquement **relues, validées ou corrigées**. Le tableau ci-dessous en rend compte.

| Tâche déléguée | Outil / collaborateur | Objectif | Vérification effectuée |
| :---- | :---- | :---- | :---- |
| Génération du script de seed des thèmes (`prisma/seed.ts`) | Claude | Gagner du temps sur une tâche répétitive (insertion des thèmes initiaux, sans back-office) | Relu le code (upsert idempotent sur `title`), exécuté `prisma db seed` puis vérifié en base que les thèmes étaient bien présents (`SELECT title FROM "Topic"`). Ajusté la liste et les descriptions des thèmes. |
| Génération des schémas de validation Zod (`lib/validations.ts`) | Claude | Gagner du temps sur la traduction des règles métier en schémas (mot de passe, inscription, connexion, profil, article, commentaire) | Relu chaque règle au regard des spécifications fonctionnelles (notamment la règle du mot de passe : ≥ 8 caractères avec chiffre, minuscule, majuscule et caractère spécial). Validé le typage (`tsc --noEmit`) ; bornes complémentaires (longueur des champs) définies manuellement. Tests unitaires prévus à l'étape de tests. |
| Génération d'articles de démonstration (`prisma/seed.ts`) | Claude | Peupler le fil d'actualité avec des contenus réalistes pour les tests et les captures d'écran | Relu les titres et contenus des articles, exécuté `prisma db seed` puis vérifié en base la présence des articles (un par thème principal). |
| Aide à la rédaction de ce document à partir des notes de développement | Claude | Mettre en forme et structurer la documentation (architecture, choix techniques, tests, revue technique) à partir des notes prises pendant le développement | Rédaction fondée sur les notes de développement et le code (sources de vérité), puis relue, corrigée et validée section par section ; chaque affirmation technique recoupée avec le code (`tsc --noEmit`, schéma Prisma, suite de tests). |

---

## **5\. Annexes**

Intégrez ici toutes les pièces justificatives :

* **Captures d'écran de l'UI** et vues principales.
* **Analyse des besoins front-end** (liens avec les spécifications ou maquettes).
* **Définition des données** (schémas Prisma, types TypeScript, règles Zod).
* **Rapports de couverture et de tests** (exports ou impressions d'écran).
* **Rapport de revue technique** (version complète, datée et signée si applicable).
