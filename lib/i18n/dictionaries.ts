export const LOCALES = ["fr", "en"] as const;
export type Locale = (typeof LOCALES)[number];
export const DEFAULT_LOCALE: Locale = "fr";
export const LOCALE_COOKIE = "lang";

const fr = {
  meta: {
    title: "Gala d'Élégance — Bal de Promo 2026",
    description: "Élection du Roi et de la Reine du bal de promotion",
  },
  lang: {
    label: "Langue",
    fr: "Français",
    en: "English",
  },
  announcement: {
    title: "Bientôt : votre propre scrutin",
    body: "Une plateforme sera bientôt mise en place pour permettre à tout le monde d'organiser ses propres votes : écoles, associations, clubs ou événements.",
  },
  lock: {
    badge: "Lecture seule",
    title: "Modifications bloquées",
    body: "Le concepteur du site a verrouillé l'administration : le vote est terminé, plus rien ne peut être ajouté, modifié ou supprimé.",
  },
  admin: {
    section: "Administration",
    logout: "Se déconnecter",
    election: "Scrutin du bal de promo 2026",
    open: "Le vote est ouvert",
    closed: "Le vote est fermé",
    closesAt: "Clôture prévue {date}.",
    openHint:
      "Les élèves peuvent voter en ce moment depuis la page publique.",
    closedHint:
      "Les élèves voient les candidats mais ne peuvent pas voter.",
    noSettings:
      "Aucune configuration trouvée. Ajoutez une ligne dans la table « settings » pour piloter le vote.",
    figures: {
      total: "votes au total",
      queen: "pour la Reine",
      king: "pour le Roi",
      candidates: "candidats en lice",
    },
    queenTitle: "Reine du bal",
    kingTitle: "Roi du bal",
    voteOne: "vote",
    voteOther: "votes",
    emptyCategory:
      "Personne ne concourt encore pour ce titre. Ajoutez un candidat avec le formulaire.",
    rank: "Rang {n}",
    share: "{p} des votes",
    cancel: "Annuler",
    add: {
      title: "Ajouter un candidat",
      hint: "Il apparaît aussitôt sur la page de vote.",
      submit: "Ajouter au scrutin",
      pending: "Ajout en cours…",
      success: "{name} a été ajouté·e au scrutin.",
      error:
        "Le candidat n'a pas été ajouté. Vérifiez le nom et le titre, puis réessayez.",
    },
    fields: {
      name: "Nom complet",
      namePlaceholder: "Ex. Aya Kouassi",
      title: "Titre visé",
      queen: "Reine",
      king: "Roi",
      photo: "Photo",
      description: "Présentation",
      optional: "(facultatif)",
      descriptionPlaceholder: "Une phrase qui apparaîtra sous sa photo.",
    },
    photo: {
      source: "Source de la photo",
      upload: "Importer",
      link: "Lien",
      choose: "Choisir une photo",
      replace: "Remplacer la photo",
      uploading: "Envoi en cours…",
      hint: "JPG, PNG ou WebP. Format portrait conseillé.",
      linkLabel: "Lien de la photo",
      linkHint: "Collez le lien direct d'une image (ImgBB par exemple).",
      remove: "Retirer la photo",
      preview: "Aperçu de la photo",
      errorFormat: "Format non accepté. Utilisez une image JPG, PNG ou WebP.",
      errorSize: "L'image dépasse 50 Mo. Choisissez une image plus légère.",
      errorUpload:
        "L'image n'a pas pu être envoyée. Réessayez ou collez un lien.",
      errorNetwork:
        "L'envoi a échoué. Vérifiez votre connexion puis réessayez.",
      errorBroken: "Cette image ne s'affiche pas. Vérifiez le lien.",
    },
    edit: {
      action: "Modifier",
      aria: "Modifier {name}",
      title: "Modifier {name}",
      hint: "Les changements apparaissent tout de suite sur la page de vote.",
      save: "Enregistrer",
      pending: "Enregistrement…",
      error: "Les modifications n'ont pas été enregistrées. Réessayez.",
    },
    remove: {
      action: "Supprimer",
      aria: "Supprimer {name}",
      title: "Supprimer {name} ?",
      bodyNone: "Cette action est définitive.",
      bodyOne: "Son vote sera perdu. Cette action est définitive.",
      bodyOther: "Ses {n} votes seront perdus. Cette action est définitive.",
      confirm: "Supprimer",
      pending: "Suppression…",
      error: "La suppression a échoué. Réessayez dans un instant.",
    },
    toggle: {
      close: "Fermer le vote",
      open: "Ouvrir le vote",
      closeTitle: "Fermer le vote ?",
      openTitle: "Ouvrir le vote ?",
      closeBody:
        "Les élèves ne pourront plus voter. Les votes déjà enregistrés sont conservés, et vous pourrez rouvrir à tout moment.",
      openBody:
        "Les élèves pourront voter dès maintenant depuis la page publique.",
      closing: "Fermeture…",
      opening: "Ouverture…",
      error: "Le statut n'a pas changé. Réessayez.",
    },
  },
  login: {
    tagline: "Les coulisses du scrutin",
    intro:
      "Ouvrez et fermez le vote, gérez les candidats et suivez le classement du Roi et de la Reine en direct.",
    footer: "Bal de promo 2026",
    title: "Connexion",
    subtitle: "Réservé au comité d'organisation.",
    email: "Adresse e-mail",
    emailPlaceholder: "nom@exemple.com",
    password: "Mot de passe",
    submit: "Se connecter",
    pending: "Connexion…",
    errors: {
      missing: "Saisissez votre e-mail et votre mot de passe.",
      invalid: "E-mail ou mot de passe incorrect.",
      forbidden: "Ce compte n'a pas accès à l'administration.",
    } as Record<string, string>,
  },
  vote: {
    badge: "Scrutin officiel 2026",
    titleBefore: "L'Élection ",
    titleAccent: "Royale",
    titleAfter: "",
    subtitle: "Célébrons l'excellence et le charisme de notre promotion",
    closedTitle: "Les votes sont actuellement fermés.",
    closedBody:
      "Vous pouvez consulter les candidats, mais aucun nouveau vote ne sera accepté.",
    queenEyebrow: "Catégorie I",
    queenTitle: "Prétendantes au titre de",
    queenAccent: "Reine",
    kingEyebrow: "Catégorie II",
    kingTitle: "Prétendants au titre de",
    kingAccent: "Roi",
    empty: "Aucun candidat disponible pour le moment.",
    footer:
      "Comité du Bal de Promo 2026 • Système de vote anonyme & sécurisé",
    card: {
      photoSoon: "Photo à venir",
      voted: "Vote enregistré",
      alreadyVoted: "Vote déjà effectué",
      cta: "Offrir mon vote",
      closedCta: "Votes fermés",
      confirmEyebrow: "Confirmation de vote",
      confirmBody:
        "Confirmez-vous l'attribution de votre unique suffrage dans cette catégorie ?",
      cancel: "Annuler",
      confirm: "Confirmer",
      pending: "Enregistrement…",
      success: "Vote enregistré",
      networkError: "Impossible d'enregistrer le vote. Réessayez.",
    },
    errors: {
      settings_error: "Impossible de vérifier le statut du vote.",
      closed: "Les votes sont actuellement fermés.",
      invalid_candidate: "Candidat invalide.",
      not_found: "Ce candidat n'existe pas.",
      invalid_category: "Catégorie de candidat invalide.",
      check_failed: "Impossible de vérifier votre vote.",
      already_voted: "Vous avez déjà voté dans cette catégorie.",
      insert_failed: "Impossible d'enregistrer le vote.",
      server_error: "Une erreur est survenue. Réessayez.",
    } as Record<string, string>,
    cookie: {
      title: "Cookie nécessaire au vote",
      body: "Ce site utilise un cookie strictement nécessaire pour mémoriser anonymement votre participation et limiter les votes multiples. Aucun suivi publicitaire ou marketing n'est effectué.",
      ok: "Compris",
    },
  },
};

export type Dictionary = typeof fr;

const en: Dictionary = {
  meta: {
    title: "Gala of Elegance — 2026 Prom",
    description: "Vote for the Prom King and Queen",
  },
  lang: {
    label: "Language",
    fr: "Français",
    en: "English",
  },
  announcement: {
    title: "Coming soon: your own election",
    body: "A platform is on its way that will let anyone run their own votes: schools, associations, clubs or events.",
  },
  lock: {
    badge: "Read-only",
    title: "Editing is locked",
    body: "The site's developer has locked the admin panel: voting is over, so nothing can be added, edited or deleted anymore.",
  },
  admin: {
    section: "Admin",
    logout: "Sign out",
    election: "2026 prom election",
    open: "Voting is open",
    closed: "Voting is closed",
    closesAt: "Scheduled to close {date}.",
    openHint: "Students can vote right now from the public page.",
    closedHint: "Students can see the candidates but can't vote.",
    noSettings:
      "No settings found. Add a row to the “settings” table to control voting.",
    figures: {
      total: "total votes",
      queen: "for Queen",
      king: "for King",
      candidates: "candidates running",
    },
    queenTitle: "Prom Queen",
    kingTitle: "Prom King",
    voteOne: "vote",
    voteOther: "votes",
    emptyCategory:
      "No one is running for this title yet. Add a candidate with the form.",
    rank: "Rank {n}",
    share: "{p} of votes",
    cancel: "Cancel",
    add: {
      title: "Add a candidate",
      hint: "They appear on the voting page right away.",
      submit: "Add to ballot",
      pending: "Adding…",
      success: "{name} was added to the ballot.",
      error:
        "The candidate wasn't added. Check the name and title, then try again.",
    },
    fields: {
      name: "Full name",
      namePlaceholder: "e.g. Aya Kouassi",
      title: "Running for",
      queen: "Queen",
      king: "King",
      photo: "Photo",
      description: "Bio",
      optional: "(optional)",
      descriptionPlaceholder: "One sentence shown under their photo.",
    },
    photo: {
      source: "Photo source",
      upload: "Upload",
      link: "Link",
      choose: "Choose a photo",
      replace: "Replace photo",
      uploading: "Uploading…",
      hint: "JPG, PNG or WebP. Portrait works best.",
      linkLabel: "Photo link",
      linkHint: "Paste a direct link to an image (from ImgBB, for example).",
      remove: "Remove photo",
      preview: "Photo preview",
      errorFormat: "Unsupported format. Use a JPG, PNG or WebP image.",
      errorSize: "The image is over 50 MB. Choose a smaller one.",
      errorUpload: "The image couldn't be uploaded. Try again or paste a link.",
      errorNetwork: "Upload failed. Check your connection and try again.",
      errorBroken: "This image won't load. Check the link.",
    },
    edit: {
      action: "Edit",
      aria: "Edit {name}",
      title: "Edit {name}",
      hint: "Changes show up on the voting page right away.",
      save: "Save",
      pending: "Saving…",
      error: "Your changes weren't saved. Try again.",
    },
    remove: {
      action: "Delete",
      aria: "Delete {name}",
      title: "Delete {name}?",
      bodyNone: "This can't be undone.",
      bodyOne: "Their 1 vote will be lost. This can't be undone.",
      bodyOther: "Their {n} votes will be lost. This can't be undone.",
      confirm: "Delete",
      pending: "Deleting…",
      error: "Deletion failed. Try again in a moment.",
    },
    toggle: {
      close: "Close voting",
      open: "Open voting",
      closeTitle: "Close voting?",
      openTitle: "Open voting?",
      closeBody:
        "Students won't be able to vote anymore. Votes already cast are kept, and you can reopen at any time.",
      openBody: "Students will be able to vote right away from the public page.",
      closing: "Closing…",
      opening: "Opening…",
      error: "The status didn't change. Try again.",
    },
  },
  login: {
    tagline: "Behind the scenes of the election",
    intro:
      "Open and close voting, manage candidates and follow the King and Queen rankings live.",
    footer: "2026 Prom",
    title: "Sign in",
    subtitle: "For the organizing committee only.",
    email: "Email address",
    emailPlaceholder: "name@example.com",
    password: "Password",
    submit: "Sign in",
    pending: "Signing in…",
    errors: {
      missing: "Enter your email and password.",
      invalid: "Incorrect email or password.",
      forbidden: "This account doesn't have admin access.",
    },
  },
  vote: {
    badge: "Official 2026 ballot",
    titleBefore: "The ",
    titleAccent: "Royal",
    titleAfter: " Election",
    subtitle: "Celebrating the brilliance and charisma of our graduating class",
    closedTitle: "Voting is currently closed.",
    closedBody: "You can still browse the candidates, but no new votes are accepted.",
    queenEyebrow: "Category I",
    queenTitle: "Contenders for the title of",
    queenAccent: "Queen",
    kingEyebrow: "Category II",
    kingTitle: "Contenders for the title of",
    kingAccent: "King",
    empty: "No candidates yet.",
    footer: "2026 Prom Committee • Anonymous & secure voting",
    card: {
      photoSoon: "Photo coming soon",
      voted: "Vote recorded",
      alreadyVoted: "Already voted",
      cta: "Cast my vote",
      closedCta: "Voting closed",
      confirmEyebrow: "Confirm your vote",
      confirmBody:
        "Do you confirm giving your one vote in this category to this candidate?",
      cancel: "Cancel",
      confirm: "Confirm",
      pending: "Recording…",
      success: "Vote recorded",
      networkError: "Your vote couldn't be recorded. Please try again.",
    },
    errors: {
      settings_error: "We couldn't check whether voting is open.",
      closed: "Voting is currently closed.",
      invalid_candidate: "Invalid candidate.",
      not_found: "This candidate doesn't exist.",
      invalid_category: "Invalid candidate category.",
      check_failed: "We couldn't check your vote.",
      already_voted: "You've already voted in this category.",
      insert_failed: "Your vote couldn't be recorded.",
      server_error: "Something went wrong. Please try again.",
    },
    cookie: {
      title: "Cookie needed to vote",
      body: "This site uses one strictly necessary cookie to anonymously remember that you voted and prevent multiple votes. No advertising or marketing tracking.",
      ok: "Got it",
    },
  },
};

export const dictionaries: Record<Locale, Dictionary> = { fr, en };

export function isLocale(value: unknown): value is Locale {
  return value === "fr" || value === "en";
}

/** Remplace {cle} par sa valeur : fmt("Rang {n}", { n: 2 }) */
export function fmt(
  template: string,
  values: Record<string, string | number>
) {
  return template.replace(/\{(\w+)\}/g, (_, key) =>
    key in values ? String(values[key]) : `{${key}}`
  );
}

/** "0 vote", "1 vote", "2 votes" en français ; "0 votes", "1 vote" en anglais. */
export function isPlural(locale: Locale, n: number) {
  return locale === "fr" ? n > 1 : n !== 1;
}

/** 46 % en français, 46% en anglais. */
export function percent(locale: Locale, value: number, digits = 0) {
  const number = value.toFixed(digits);
  return locale === "fr" ? `${number.replace(".", ",")} %` : `${number}%`;
}

export function dateLocale(locale: Locale) {
  return locale === "fr" ? "fr-FR" : "en-US";
}
