import { PrismaClient } from "@prisma/client";

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

  console.log(`Seed terminé : ${topics.length} thèmes garantis en base.`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
