import {
  ContentCard,
  ContentCardText,
  ContentCardTitle,
} from "@/components/content-card";

type TopicCardProps = {
  title: string;
  description: string;
  action?: React.ReactNode;
};

/**
 * Carte d'un thème : titre, description (tronquée à 3 lignes) et zone d'action
 * optionnelle (« S'abonner » sur la page des thèmes, « Se désabonner » au profil).
 */
export const TopicCard = ({ title, description, action }: TopicCardProps) => {
  return (
    <ContentCard className="h-full">
      <ContentCardTitle>{title}</ContentCardTitle>
      <ContentCardText className="line-clamp-3 flex-1">
        {description}
      </ContentCardText>
      {action ? <div>{action}</div> : null}
    </ContentCard>
  );
};
