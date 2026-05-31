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
  {
    title: "Architecture logicielle",
    description:
      "L'architecture logicielle regroupe l'ensemble des décisions structurantes d'un projet : découpage en modules, séparation des responsabilités, choix des frontières entre couches et gestion des dépendances. Elle couvre aussi bien les patterns classiques (MVC, hexagonal, clean architecture) que les principes fondamentaux comme SOLID, l'inversion de dépendances ou la séparation des préoccupations. Une bonne architecture facilite la maintenance, les tests et l'évolution du code sur le long terme, tout en limitant la dette technique. Ce thème aborde la modélisation, les compromis entre simplicité et flexibilité, ainsi que les stratégies de montée en charge des applications modernes.",
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
