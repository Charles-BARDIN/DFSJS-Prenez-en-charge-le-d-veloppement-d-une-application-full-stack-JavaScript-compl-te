/**
 * Format de retour homogène des Server Actions de mutation.
 * Permet aux composants de traiter succès et erreurs de façon uniforme.
 */
export type ActionResult<T = void> =
  | { success: true; data: T }
  | { success: false; error: string; fieldErrors?: Record<string, string> };

/** Construit un résultat de succès. */
export const ok = <T>(data: T): ActionResult<T> => ({ success: true, data });

/** Construit un résultat d'échec. */
export const fail = (
  error: string,
  fieldErrors?: Record<string, string>,
): ActionResult<never> => ({ success: false, error, fieldErrors });
