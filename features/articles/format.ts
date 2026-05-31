/** Formate une date pour l'affichage (format français court). */
export const formatDate = (date: Date) => {
  return new Intl.DateTimeFormat("fr-FR", {
    dateStyle: "long",
  }).format(date);
};
