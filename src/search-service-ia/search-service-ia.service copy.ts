import { Injectable, OnModuleInit } from '@nestjs/common';
import * as tf from '@tensorflow/tfjs-node';
import * as mobilenet from '@tensorflow-models/mobilenet';
import { ServiceService } from '../service/service.service';

@Injectable()
export class SearchServiceIaService implements OnModuleInit {
  private model: mobilenet.MobileNet;

  // Seuil de confiance minimal (85%)
  private readonly CONFIDENCE_THRESHOLD = 0.85;

  constructor(private readonly serviceService: ServiceService) { }

  async onModuleInit() {
    console.log('Loading MobileNet model...');
    this.model = await mobilenet.load();
    console.log('MobileNet model loaded.');
  }

  /**
   * Interprète l'intention réelle à partir des labels détectés.
   * Transforme les objets techniques anglais en intentions de service français.
   */
  private interpretIntention(predictions: any[]): string | null {
    if (!predictions || predictions.length === 0) return null;

    const topPrediction = predictions[0];

    // Règle 1: Vérification du seuil de confiance (50%)
    if (topPrediction.probability < this.CONFIDENCE_THRESHOLD) {
      console.log(`Confidence too low: ${topPrediction.probability * 100}% < 50%`,);
      return null;
    }

    // Règle 2: Extraction de l'intention à partir des labels
    // On analyse les labels retournés pour identifier un domaine de service
    const labels = predictions.map((p) => p.className.toLowerCase()).join(' ');

    // Moteur d'interprétation sémantique simplifié (Intention automatique)
    if (labels.match(/pipe|faucet|plumber|sink|washbasin|water|drain|plunger/))
      return 'Plomberie';
    if (
      labels.match(/wire|electrical|outlet|switch|bulb|light|electricity|power/)
    )
      return 'Électricité';
    if (labels.match(/hammer|screw|tool|drill|wood|carpenter|wrench|pliers/))
      return 'Bricolage Menuiserie';
    if (labels.match(/car|wheel|engine|automotive|tire|motor|mechanic/))
      return 'Mécanique Automobile';
    if (
      labels.match(/computer|laptop|screen|keyboard|mouse|network|internet|software/,)
    )
      return 'Informatique';
    if (labels.match(/clean|broom|vacuum|mop|dust|laundry|wash/))
      return 'Ménage Nettoyage';
    if (labels.match(/grass|garden|tree|plant|leaf|mower|flower/))
      return 'Jardinage';
    if (labels.match(/air conditioner|cooling|refrigerator|fridge|heater|hvac/))
      return 'Climatisation Froid';
    if (labels.match(/lock|key|door|safe|security/)) return 'Serrurerie';
    if (labels.match(/paint|brush|roller|wall|decoration/)) return 'Peinture';
    if (labels.match(/truck|box|moving|van|transport/)) return 'Déménagement';

    // Si aucune intention forte n'est détectée mais que la confiance est haute,
    // on retourne le label brut (mieux que rien)
    return topPrediction.className.split(',')[0].trim();
  }

  async searchByImage(file: Express.Multer.File) {
    if (!file) throw new Error('No file provided');

    try {
      // Décodage de l'image
      const image = tf.node.decodeImage(file.buffer);

      // Classification (top 5 pour analyse de contexte)
      const predictions = await this.model.classify(image as tf.Tensor3D, 5);
      console.log('Predictions:', predictions);
      // Nettoyage immédiat des tensors
      image.dispose();

      // Interprétation de l'intention automatique
      const intention = this.interpretIntention(predictions);

      if (!intention) {
        return {
          data: [],
          isFallback: false,
          message: 'Nous n’avons pas trouvé de service correspondant à cette image. Veuillez réessayer ou saisir le nom du service.',
          predictions,
        };
      }

      console.log(`IA Intention Identified: "${intention}" (Confidence: ${Math.round(predictions[0].probability * 100)}%)`,);

      // Recherche automatique des services correspondants dans la base de données
      const results = await this.serviceService.findAll({
        query: intention,
        page: 1,
        limit: 10,
      });

      // Si aucun service n'est trouvé en base pour cette intention
      if (!results.data || results.data.length === 0) {
        return {
          data: [],
          isFallback: false,
          message: 'Nous n’avons pas trouvé de service correspondant à cette image. Veuillez réessayer ou saisir le nom du service.',
          predictions,
          intention,
        };
      }

      return {
        ...results,
        predictions,
        intention,
        message: 'Service(s) trouvé(s) avec succès.',
      };
    } catch (error) {
      console.error('AI Image Search Error:', error);
      throw new Error("Erreur lors de l'analyse de l'image par l'IA.");
    }
  }
}
