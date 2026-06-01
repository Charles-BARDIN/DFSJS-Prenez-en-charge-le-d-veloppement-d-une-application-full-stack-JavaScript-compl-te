/**
 * Affichage d'un commentaire : nom d'auteur à gauche du contenu sur desktop,
 * au-dessus (aligné à droite) sur mobile — conforme à la maquette.
 */
export const CommentItem = ({
  username,
  content,
}: {
  username: string;
  content: string;
}) => {
  return (
    <li className="flex flex-col gap-1 sm:flex-row sm:items-start sm:gap-4">
      <p className="text-right text-sm font-medium text-foreground sm:w-32 sm:shrink-0 sm:text-left">
        {username}
      </p>
      <p className="min-w-0 flex-1 rounded-lg bg-muted p-4 text-sm break-words text-foreground">
        {content}
      </p>
    </li>
  );
};
