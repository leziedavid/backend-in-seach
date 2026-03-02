/**
 * Expansion sémantique de l'intention IA vers des mots-clés métier
 *
 * Permet de transformer une intention détectée (ex: "Plombier")
 * en un ensemble de termes métier (ex: ["plombier", "fuite", "tuyau", ...])
 * pour enrichir les requêtes de recherche en base de données.
 */

const INTENTION_MAP: Record<string, string[]> = {
    // ── Plomberie ─────────────────────────────────────────────────────────────
    plombier: ['plombier', 'plomberie', 'robinet', 'fuite', 'tuyau', 'canalisation', 'chauffe-eau', 'sanitaire', 'dépannage plomberie'],
    plomberie: ['plombier', 'plomberie', 'robinet', 'fuite', 'tuyau', 'canalisation', 'chauffe-eau', 'sanitaire'],

    // ── Électricité ───────────────────────────────────────────────────────────
    electricien: ['électricien', 'électricité', 'câblage', 'tableau électrique', 'prise', 'interrupteur', 'installation électrique'],
    électricien: ['électricien', 'électricité', 'câblage', 'tableau électrique', 'prise', 'interrupteur', 'installation électrique'],
    électricité: ['électricien', 'électricité', 'câblage', 'tableau électrique', 'prise', 'interrupteur'],
    electricite: ['électricien', 'électricité', 'câblage', 'tableau électrique', 'prise', 'interrupteur'],

    // ── Électrotechnique ──────────────────────────────────────────────────────
    electrotechnicien: ['électrotechnicien', 'électrotechnique', 'moteur', 'variateur', 'automatisme', 'armoire électrique', 'onduleur'],
    électrotechnicien: ['électrotechnicien', 'électrotechnique', 'moteur', 'variateur', 'automatisme', 'armoire électrique', 'onduleur'],

    // ── Serrurerie ────────────────────────────────────────────────────────────
    serrurier: ['serrurier', 'serrurerie', 'serrure', 'clé', 'verrou', 'blindage', 'porte blindée', 'ouverture de porte'],
    serrurerie: ['serrurier', 'serrurerie', 'serrure', 'clé', 'verrou', 'blindage'],

    // ── Ferronnerie ───────────────────────────────────────────────────────────
    ferronnier: ['ferronnier', 'ferronnerie', 'portail', 'grille', 'garde-corps', 'rampe', 'clôture', 'soudure', 'métallerie'],
    ferronnerie: ['ferronnier', 'ferronnerie', 'portail', 'grille', 'garde-corps', 'rampe', 'clôture', 'soudure'],

    // ── Peinture ──────────────────────────────────────────────────────────────
    peintre: ['peintre', 'peinture', 'ravalement', 'papier peint', 'enduit', 'façade', 'décoration intérieure'],
    peinture: ['peintre', 'peinture', 'ravalement', 'papier peint', 'enduit', 'façade'],

    // ── Ménage / Nettoyage ────────────────────────────────────────────────────
    ménage: ['ménage', 'nettoyage', 'nettoyeur', 'femme de ménage', 'entretien', 'désinfection', 'propreté'],
    menage: ['ménage', 'nettoyage', 'nettoyeur', 'femme de ménage', 'entretien', 'désinfection', 'propreté'],
    nettoyage: ['ménage', 'nettoyage', 'nettoyeur', 'entretien', 'désinfection', 'propreté'],

    // ── Jardinage ─────────────────────────────────────────────────────────────
    jardinier: ['jardinier', 'jardinage', 'tonte', 'taille', 'élagage', 'pelouse', 'haie', 'arrosage', 'espaces verts'],
    jardinage: ['jardinier', 'jardinage', 'tonte', 'taille', 'élagage', 'pelouse', 'haie', 'arrosage'],

    // ── Informatique ──────────────────────────────────────────────────────────
    informatique: ['informatique', 'dépannage informatique', 'ordinateur', 'réseau', 'wifi', 'serveur', 'installation logiciel'],

    // ── Climatisation ─────────────────────────────────────────────────────────
    climatisation: ['climatisation', 'climatiseur', 'ventilation', 'CVC', 'pompe à chaleur', 'installation clim'],
    climatiseur: ['climatisation', 'climatiseur', 'ventilation', 'CVC', 'pompe à chaleur'],

    // ── Spécialiste Froid ─────────────────────────────────────────────────────
    'spécialiste froid': ['froid', 'réfrigération', 'chambre froide', 'congélateur', 'groupe froid', 'maintenance froid'],
    'specialiste froid': ['froid', 'réfrigération', 'chambre froide', 'congélateur', 'groupe froid', 'maintenance froid'],
    froid: ['froid', 'réfrigération', 'chambre froide', 'congélateur', 'groupe froid'],

    // ── Chauffage ─────────────────────────────────────────────────────────────
    chauffagiste: ['chauffagiste', 'chauffage', 'chaudière', 'radiateur', 'plancher chauffant', 'gaz', 'fioul', 'poêle'],
    chauffage: ['chauffagiste', 'chauffage', 'chaudière', 'radiateur', 'plancher chauffant'],

    // ── Déménagement ──────────────────────────────────────────────────────────
    déménagement: ['déménagement', 'déménageur', 'transport', 'camion', 'livraison', 'manutention'],
    demenagement: ['déménagement', 'déménageur', 'transport', 'camion', 'livraison', 'manutention'],
    déménageur: ['déménagement', 'déménageur', 'transport', 'camion', 'manutention'],

    // ── Mécanique Automobile ──────────────────────────────────────────────────
    mécanique: ['mécanique', 'mécanicien', 'garage', 'voiture', 'réparation auto', 'entretien auto', 'vidange'],
    mecanique: ['mécanique', 'mécanicien', 'garage', 'voiture', 'réparation auto', 'entretien auto', 'vidange'],
    mécanicien: ['mécanique', 'mécanicien', 'garage', 'voiture', 'réparation auto', 'entretien auto'],

    // ── Menuiserie ────────────────────────────────────────────────────────────
    menuisier: ['menuisier', 'menuiserie', 'charpente', 'parquet', 'porte', 'placard', 'bois', 'escalier'],
    menuiserie: ['menuisier', 'menuiserie', 'charpente', 'parquet', 'porte', 'placard', 'bois'],

    // ── Carrelage ─────────────────────────────────────────────────────────────
    carreleur: ['carreleur', 'carrelage', 'faïence', 'sol', 'pose carrelage', 'salle de bain', 'cuisine carrelage'],
    carrelage: ['carreleur', 'carrelage', 'faïence', 'sol', 'pose carrelage'],

    // ── Maçonnerie ────────────────────────────────────────────────────────────
    maçon: ['maçon', 'maçonnerie', 'béton', 'mur', 'fondation', 'rénovation', 'gros œuvre', 'dalle', 'parpaing'],
    macon: ['maçon', 'maçonnerie', 'béton', 'mur', 'fondation', 'rénovation', 'gros œuvre', 'dalle'],
    maçonnerie: ['maçon', 'maçonnerie', 'béton', 'mur', 'fondation', 'rénovation', 'gros œuvre'],

    // ── Staff / Plâtrerie ─────────────────────────────────────────────────────
    staffeur: ['staffeur', 'staff', 'plâtrier', 'plâtre', 'cloison', 'faux plafond', 'enduit', 'gyproc'],
    plâtrier: ['staffeur', 'plâtrier', 'plâtre', 'cloison', 'faux plafond', 'enduit', 'gyproc'],
    platrier: ['staffeur', 'plâtrier', 'plâtre', 'cloison', 'faux plafond', 'enduit', 'gyproc'],

    // ── Vitrerie / ALU ────────────────────────────────────────────────────────
    'vitrier alu': ['vitrier', 'vitrerie', 'aluminium', 'double vitrage', 'fenêtre', 'baie vitrée', 'porte-fenêtre', 'velux', 'châssis'],
    vitrier: ['vitrier', 'vitrerie', 'aluminium', 'double vitrage', 'fenêtre', 'baie vitrée', 'porte-fenêtre'],
    vitrerie: ['vitrier', 'vitrerie', 'aluminium', 'double vitrage', 'fenêtre', 'baie vitrée'],
};

/**
 * Normalise une chaîne : minuscules, suppression des accents, trim
 */
const normalize = (str: string): string => str.toLowerCase().trim().normalize('NFD').replace(/[\u0300-\u036f]/g, ''); // supprime les diacritiques

/**
 * Expand une intention (query IA ou saisie utilisateur) en une liste
 * de mots-clés métier pour enrichir les requêtes de recherche.
 *
 * @param query - L'intention détectée (ex: "Plombier", "électricité", "maçon")
 * @returns Un tableau de termes de recherche enrichis
 *
 * @example
 * expandIntention("Plombier")
 * // → ["plombier", "plomberie", "robinet", "fuite", "tuyau", ...]
 *
 * @example
 * expandIntention("service inconnu")
 * // → ["service inconnu"]  ← retourne le terme original si aucun match
 */

export const expandIntention = (query: string): string[] => {
    if (!query || query.trim() === '') return [];

    const normalized = normalize(query);
    // 1. Recherche exacte (clé normalisée)
    const exactKey = Object.keys(INTENTION_MAP).find((key) => normalize(key) === normalized,);
    if (exactKey) return INTENTION_MAP[exactKey];

    // 2. Recherche partielle : la query contient la clé ou la clé contient la query
    const partialKey = Object.keys(INTENTION_MAP).find((key) => normalized.includes(normalize(key)) || normalize(key).includes(normalized),);
    if (partialKey) return INTENTION_MAP[partialKey];

    // 3. Aucun match → retourner le terme original pour ne pas bloquer la recherche
    console.warn(`[expandIntention] No semantic match found for: "${query}"`);
    return [query];

};