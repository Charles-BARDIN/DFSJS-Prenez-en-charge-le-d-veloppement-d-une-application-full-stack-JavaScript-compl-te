import { getTopics } from "@/features/themes/queries";

// Server Component : les thèmes sont lus côté serveur via Prisma.
// La mise en forme sera ajoutée lors de l'étape d'intégration des maquettes.
const ThemesPage = async () => {
  const topics = await getTopics();

  return (
    <main>
      <h1>Thèmes</h1>
      <ul>
        {topics.map((topic) => (
          <li key={topic.id}>
            <h2>{topic.title}</h2>
            <p>{topic.description}</p>
          </li>
        ))}
      </ul>
    </main>
  );
};

export default ThemesPage;
