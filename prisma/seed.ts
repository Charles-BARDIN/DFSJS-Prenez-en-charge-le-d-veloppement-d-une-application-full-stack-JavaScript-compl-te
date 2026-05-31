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

  // Auteur de démonstration (mot de passe haché, compte utilisable).
  const password = await bcrypt.hash("Demo#1234", 10);
  const author = await prisma.user.upsert({
    where: { email: demoAuthor.email },
    update: {},
    create: { ...demoAuthor, password },
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

  console.log(
    `Seed terminé : ${topics.length} thèmes, 1 auteur de démo et ${articles.length} articles garantis en base.`,
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
