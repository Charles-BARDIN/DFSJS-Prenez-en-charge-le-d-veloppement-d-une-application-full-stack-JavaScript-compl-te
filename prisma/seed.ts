import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

/**
 * Thèmes initiaux du réseau social.
 * Insérés via ce script car le MVP ne prévoit pas de back-office.
 */
const topics = [
  {
    title: "JavaScript",
    description:
      "Le langage du web : fondamentaux, ES2015+, asynchrone et bonnes pratiques.",
  },
  {
    title: "TypeScript",
    description:
      "JavaScript typé : typage statique, génériques et sécurité à grande échelle.",
  },
  {
    title: "React",
    description:
      "Bibliothèque d'interfaces : composants, hooks et gestion d'état côté client.",
  },
  {
    title: "Next.js",
    description:
      "Framework full-stack React : App Router, Server Components et Server Actions.",
  },
  {
    title: "Node.js",
    description:
      "JavaScript côté serveur : runtime, écosystème npm et applications back-end.",
  },
  {
    title: "Bases de données",
    description:
      "Modélisation, SQL, ORM et performance des systèmes de stockage relationnels.",
  },
  {
    title: "DevOps",
    description:
      "Intégration et déploiement continus, conteneurs et automatisation.",
  },
  {
    title: "Architecture logicielle",
    description:
      "L'architecture logicielle regroupe l'ensemble des décisions structurantes d'un projet : découpage en modules, séparation des responsabilités, choix des frontières entre couches et gestion des dépendances. Elle couvre aussi bien les patterns classiques (MVC, hexagonal, clean architecture) que les principes fondamentaux comme SOLID, l'inversion de dépendances ou la séparation des préoccupations. Une bonne architecture facilite la maintenance, les tests et l'évolution du code sur le long terme, tout en limitant la dette technique. Ce thème aborde la modélisation, les compromis entre simplicité et flexibilité, ainsi que les stratégies de montée en charge des applications modernes.",
  },
];

/**
 * Auteur de démonstration et articles associés (un par thème), pour peupler le
 * fil d'actualité. Le `topic` est référencé par son titre (unique).
 */
const demoAuthor = {
  email: "marie.dev@mdd.local",
  username: "marie_dev",
};

/** Second compte de démonstration, pour des commentaires d'un autre utilisateur. */
const demoCommenter = {
  email: "paul.dev@mdd.local",
  username: "paul_dev",
};

/** Thèmes auxquels l'auteur de démo est abonné (titres uniques). */
const demoSubscriptions = ["JavaScript", "TypeScript", "React", "Next.js"];

/**
 * Commentaires de démonstration. `author` vaut "marie" (l'auteur de démo) ou
 * "paul" (le second compte) ; `articleId` référence un article du seed.
 */
const comments = [
  {
    id: "seed-comment-1",
    articleId: "seed-article-js",
    author: "paul",
    content:
      "Merci pour cet article, l'exemple du compteur rend les closures beaucoup plus claires.",
  },
  {
    id: "seed-comment-2",
    articleId: "seed-article-js",
    author: "marie",
    content:
      "Avec plaisir ! N'hésite pas si tu veux que je détaille le cas des closures dans une boucle.",
  },
  {
    id: "seed-comment-3",
    articleId: "seed-article-react",
    author: "paul",
    content:
      "Le coup des dépendances manquantes dans useEffect m'a déjà joué des tours. Bon rappel.",
  },
  {
    id: "seed-comment-4",
    articleId: "seed-article-next",
    author: "paul",
    content:
      "Les Server Actions simplifient vraiment le code, fini les routes d'API pour le moindre formulaire.",
  },
];

const articles = [
  {
    id: "seed-article-js",
    topicTitle: "JavaScript",
    title: "Comprendre les closures en JavaScript",
    content:
      "Une closure est une fonction qui capture les variables de son environnement de définition. C'est un concept fondamental pour comprendre les callbacks, la gestion d'état et l'encapsulation en JavaScript. Dans cet article, nous explorons des exemples concrets et les pièges les plus courants.",
  },
  {
    id: "seed-article-ts",
    topicTitle: "TypeScript",
    title: "Les types utilitaires à connaître",
    content:
      "TypeScript fournit des types utilitaires puissants comme Partial, Pick, Omit ou Record. Bien maîtrisés, ils permettent d'écrire des types expressifs sans duplication. Tour d'horizon des plus utiles au quotidien avec des cas d'usage réels.",
  },
  {
    id: "seed-article-react",
    topicTitle: "React",
    title: "useEffect : éviter les erreurs classiques",
    content:
      "Le hook useEffect est souvent mal utilisé : dépendances manquantes, effets en cascade, nettoyage oublié. Cet article récapitule les bonnes pratiques pour des effets prévisibles et des composants plus robustes.",
  },
  {
    id: "seed-article-next",
    topicTitle: "Next.js",
    title: "Server Actions : la nouvelle façon de muter les données",
    content:
      "Avec l'App Router, les Server Actions remplacent une bonne partie des routes d'API. On les appelle comme des fonctions depuis le client, avec validation et sécurité côté serveur. Découvrons comment structurer proprement ses mutations.",
  },
  {
    id: "seed-article-node",
    topicTitle: "Node.js",
    title: "Streams Node.js : traiter de gros volumes",
    content:
      "Les streams permettent de traiter des données au fil de l'eau sans tout charger en mémoire. Indispensables pour les fichiers volumineux ou les flux réseau, ils demandent toutefois de bien comprendre le backpressure.",
  },
  {
    id: "seed-article-db",
    topicTitle: "Bases de données",
    title: "Index : la clé des requêtes performantes",
    content:
      "Un index bien choisi peut transformer une requête lente en réponse instantanée. Mais trop d'index ralentit les écritures. Cet article explique comment identifier les colonnes à indexer et mesurer l'impact réel.",
  },
];

async function main() {
  for (const topic of topics) {
    // Upsert pour rendre le seed idempotent (rejouable sans créer de doublons).
    await prisma.topic.upsert({
      where: { title: topic.title },
      update: {},
      create: topic,
    });
  }

  // Comptes de démonstration (mot de passe haché, comptes utilisables).
  const password = await bcrypt.hash("Demo#1234", 10);
  const author = await prisma.user.upsert({
    where: { email: demoAuthor.email },
    update: {},
    create: { ...demoAuthor, password },
  });
  const commenter = await prisma.user.upsert({
    where: { email: demoCommenter.email },
    update: {},
    create: { ...demoCommenter, password },
  });

  for (const article of articles) {
    const topic = await prisma.topic.findUnique({
      where: { title: article.topicTitle },
    });
    if (!topic) continue;

    await prisma.article.upsert({
      where: { id: article.id },
      update: {},
      create: {
        id: article.id,
        title: article.title,
        content: article.content,
        authorId: author.id,
        topicId: topic.id,
      },
    });
  }

  // Abonnements de l'auteur de démo (pour peupler son fil d'actualité).
  for (const title of demoSubscriptions) {
    const topic = await prisma.topic.findUnique({ where: { title } });
    if (!topic) continue;

    await prisma.subscription.upsert({
      where: { userId_topicId: { userId: author.id, topicId: topic.id } },
      update: {},
      create: { userId: author.id, topicId: topic.id },
    });
  }

  // Commentaires de démonstration sur quelques articles.
  for (const comment of comments) {
    await prisma.comment.upsert({
      where: { id: comment.id },
      update: {},
      create: {
        id: comment.id,
        content: comment.content,
        articleId: comment.articleId,
        authorId: comment.author === "marie" ? author.id : commenter.id,
      },
    });
  }

  console.log(
    `Seed terminé : ${topics.length} thèmes, 2 comptes de démo, ${articles.length} articles, ${demoSubscriptions.length} abonnements et ${comments.length} commentaires garantis en base.`,
  );
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
