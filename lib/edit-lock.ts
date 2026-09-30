/**
 * Verrou de l'administration.
 *
 * Le vote est terminé : tant que ce verrou est actif, aucune
 * action d'admin (ajout, modification, suppression, ouverture ou
 * fermeture du vote, envoi de photo) n'aboutit — ni depuis
 * l'interface, ni en appelant directement les Server Actions.
 *
 * Pour déverrouiller : définir NEXT_PUBLIC_ADMIN_EDITS_LOCKED=false
 * dans .env.local (ou sur Vercel), puis redémarrer / redéployer.
 */
export const EDITS_LOCKED =
  process.env.NEXT_PUBLIC_ADMIN_EDITS_LOCKED !== "false";
