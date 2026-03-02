"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.expandIntention = void 0;
const INTENTION_MAP = {
    plombier: ['plombier', 'plomberie', 'robinet', 'fuite', 'tuyau', 'canalisation', 'chauffe-eau', 'sanitaire', 'dépannage plomberie'],
    plomberie: ['plombier', 'plomberie', 'robinet', 'fuite', 'tuyau', 'canalisation', 'chauffe-eau', 'sanitaire'],
    electricien: ['électricien', 'électricité', 'câblage', 'tableau électrique', 'prise', 'interrupteur', 'installation électrique'],
    électricien: ['électricien', 'électricité', 'câblage', 'tableau électrique', 'prise', 'interrupteur', 'installation électrique'],
    électricité: ['électricien', 'électricité', 'câblage', 'tableau électrique', 'prise', 'interrupteur'],
    electricite: ['électricien', 'électricité', 'câblage', 'tableau électrique', 'prise', 'interrupteur'],
    electrotechnicien: ['électrotechnicien', 'électrotechnique', 'moteur', 'variateur', 'automatisme', 'armoire électrique', 'onduleur'],
    électrotechnicien: ['électrotechnicien', 'électrotechnique', 'moteur', 'variateur', 'automatisme', 'armoire électrique', 'onduleur'],
    serrurier: ['serrurier', 'serrurerie', 'serrure', 'clé', 'verrou', 'blindage', 'porte blindée', 'ouverture de porte'],
    serrurerie: ['serrurier', 'serrurerie', 'serrure', 'clé', 'verrou', 'blindage'],
    ferronnier: ['ferronnier', 'ferronnerie', 'portail', 'grille', 'garde-corps', 'rampe', 'clôture', 'soudure', 'métallerie'],
    ferronnerie: ['ferronnier', 'ferronnerie', 'portail', 'grille', 'garde-corps', 'rampe', 'clôture', 'soudure'],
    peintre: ['peintre', 'peinture', 'ravalement', 'papier peint', 'enduit', 'façade', 'décoration intérieure'],
    peinture: ['peintre', 'peinture', 'ravalement', 'papier peint', 'enduit', 'façade'],
    ménage: ['ménage', 'nettoyage', 'nettoyeur', 'femme de ménage', 'entretien', 'désinfection', 'propreté'],
    menage: ['ménage', 'nettoyage', 'nettoyeur', 'femme de ménage', 'entretien', 'désinfection', 'propreté'],
    nettoyage: ['ménage', 'nettoyage', 'nettoyeur', 'entretien', 'désinfection', 'propreté'],
    jardinier: ['jardinier', 'jardinage', 'tonte', 'taille', 'élagage', 'pelouse', 'haie', 'arrosage', 'espaces verts'],
    jardinage: ['jardinier', 'jardinage', 'tonte', 'taille', 'élagage', 'pelouse', 'haie', 'arrosage'],
    informatique: ['informatique', 'dépannage informatique', 'ordinateur', 'réseau', 'wifi', 'serveur', 'installation logiciel'],
    climatisation: ['climatisation', 'climatiseur', 'ventilation', 'CVC', 'pompe à chaleur', 'installation clim'],
    climatiseur: ['climatisation', 'climatiseur', 'ventilation', 'CVC', 'pompe à chaleur'],
    'spécialiste froid': ['froid', 'réfrigération', 'chambre froide', 'congélateur', 'groupe froid', 'maintenance froid'],
    'specialiste froid': ['froid', 'réfrigération', 'chambre froide', 'congélateur', 'groupe froid', 'maintenance froid'],
    froid: ['froid', 'réfrigération', 'chambre froide', 'congélateur', 'groupe froid'],
    chauffagiste: ['chauffagiste', 'chauffage', 'chaudière', 'radiateur', 'plancher chauffant', 'gaz', 'fioul', 'poêle'],
    chauffage: ['chauffagiste', 'chauffage', 'chaudière', 'radiateur', 'plancher chauffant'],
    déménagement: ['déménagement', 'déménageur', 'transport', 'camion', 'livraison', 'manutention'],
    demenagement: ['déménagement', 'déménageur', 'transport', 'camion', 'livraison', 'manutention'],
    déménageur: ['déménagement', 'déménageur', 'transport', 'camion', 'manutention'],
    mécanique: ['mécanique', 'mécanicien', 'garage', 'voiture', 'réparation auto', 'entretien auto', 'vidange'],
    mecanique: ['mécanique', 'mécanicien', 'garage', 'voiture', 'réparation auto', 'entretien auto', 'vidange'],
    mécanicien: ['mécanique', 'mécanicien', 'garage', 'voiture', 'réparation auto', 'entretien auto'],
    menuisier: ['menuisier', 'menuiserie', 'charpente', 'parquet', 'porte', 'placard', 'bois', 'escalier'],
    menuiserie: ['menuisier', 'menuiserie', 'charpente', 'parquet', 'porte', 'placard', 'bois'],
    carreleur: ['carreleur', 'carrelage', 'faïence', 'sol', 'pose carrelage', 'salle de bain', 'cuisine carrelage'],
    carrelage: ['carreleur', 'carrelage', 'faïence', 'sol', 'pose carrelage'],
    maçon: ['maçon', 'maçonnerie', 'béton', 'mur', 'fondation', 'rénovation', 'gros œuvre', 'dalle', 'parpaing'],
    macon: ['maçon', 'maçonnerie', 'béton', 'mur', 'fondation', 'rénovation', 'gros œuvre', 'dalle'],
    maçonnerie: ['maçon', 'maçonnerie', 'béton', 'mur', 'fondation', 'rénovation', 'gros œuvre'],
    staffeur: ['staffeur', 'staff', 'plâtrier', 'plâtre', 'cloison', 'faux plafond', 'enduit', 'gyproc'],
    plâtrier: ['staffeur', 'plâtrier', 'plâtre', 'cloison', 'faux plafond', 'enduit', 'gyproc'],
    platrier: ['staffeur', 'plâtrier', 'plâtre', 'cloison', 'faux plafond', 'enduit', 'gyproc'],
    'vitrier alu': ['vitrier', 'vitrerie', 'aluminium', 'double vitrage', 'fenêtre', 'baie vitrée', 'porte-fenêtre', 'velux', 'châssis'],
    vitrier: ['vitrier', 'vitrerie', 'aluminium', 'double vitrage', 'fenêtre', 'baie vitrée', 'porte-fenêtre'],
    vitrerie: ['vitrier', 'vitrerie', 'aluminium', 'double vitrage', 'fenêtre', 'baie vitrée'],
};
const normalize = (str) => str.toLowerCase().trim().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
const expandIntention = (query) => {
    if (!query || query.trim() === '')
        return [];
    const normalized = normalize(query);
    const exactKey = Object.keys(INTENTION_MAP).find((key) => normalize(key) === normalized);
    if (exactKey)
        return INTENTION_MAP[exactKey];
    const partialKey = Object.keys(INTENTION_MAP).find((key) => normalized.includes(normalize(key)) || normalize(key).includes(normalized));
    if (partialKey)
        return INTENTION_MAP[partialKey];
    console.warn(`[expandIntention] No semantic match found for: "${query}"`);
    return [query];
};
exports.expandIntention = expandIntention;
//# sourceMappingURL=expand-intention.util.js.map