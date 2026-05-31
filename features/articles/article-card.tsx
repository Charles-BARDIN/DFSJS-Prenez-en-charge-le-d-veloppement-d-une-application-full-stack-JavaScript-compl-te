import Link from "next/link";

import {
  ContentCard,
  ContentCardText,
  ContentCardTitle,
} from "@/components/content-card";
import { formatDate } from "@/features/articles/format";

type ArticleCardProps = {
  id: string;
  title: string;
  content: string;
  authorName: string;
  topicTitle: string;
  createdAt: Date;
};

// Carte d'un article dans le fil : titre cliquable, méta (date, auteur, thème)
// et extrait du contenu tronqué.
export const ArticleCard = ({
  id,
  title,
  content,
  authorName,
  topicTitle,
  createdAt,
}: ArticleCardProps) => {
  return (
    <Link href={`/articles/${id}`} className="block">
      <ContentCard className="h-full transition-opacity hover:opacity-80">
        <ContentCardTitle>{title}</ContentCardTitle>
        <p className="text-sm text-foreground">
          {formatDate(createdAt)} · {authorName} · {topicTitle}
        </p>
        <ContentCardText className="line-clamp-5">{content}</ContentCardText>
      </ContentCard>
    </Link>
  );
};
