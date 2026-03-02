import { Injectable, OnModuleInit } from '@nestjs/common';
import * as tf from '@tensorflow/tfjs-node';
import * as mobilenet from '@tensorflow-models/mobilenet';
import { ServiceService } from '../service/service.service';

@Injectable()
export class SearchServiceIaService implements OnModuleInit {
  private model: mobilenet.MobileNet;

  private readonly CONFIDENCE_THRESHOLD = 0.20;

  constructor(private readonly serviceService: ServiceService) { }

  async onModuleInit() {
    try {
      console.log('Loading MobileNet model...');
      this.model = await mobilenet.load({ version: 2, alpha: 1.0 });
      console.log('✅ MobileNet model loaded.');
    } catch (error) {
      console.error('⚠️ Failed to load MobileNet model:', error.message);
      console.log('AI Image Search will be unavailable until the model is loaded.');
      // Ne pas relancer l'erreur pour permettre à l'application de démarrer sans l'IA
    }
  }

  /**
   * Carte sémantique complète basée sur les services de la plateforme
   * Labels en anglais (ImageNet/MobileNet) → Service en français
   */
  private readonly SERVICE_MAP: { pattern: RegExp; service: string; aliases: string[] }[] = [
    {
      service: 'Plombier',
      aliases: ['Plomberie'],
      pattern: /pipe|faucet|plumb|sink|washbasin|drain|plunger|tap|valve|shower|bathtub|toilet|basin|water.*heater|boiler|wrench|spanner|leak|tube|hose|fixture|sewage|gutter.*pipe|copper.*pipe/,
    },
    {
      service: 'Electricien',
      aliases: ['Électricité', 'Électricien'],
      pattern: /wire|electrical|outlet|socket|switch|bulb|light|lamp|electricity|power|circuit|cable|fuse|panel|generator|transformer|plug|voltage|wiring|breaker|conduit|junction.*box/,
    },
    {
      service: 'Electrotechnicien',
      aliases: ['Electrotechnique'],
      pattern: /motor|inverter|relay|contactor|servo|automation|industrial.*panel|plc|frequency.*drive|electrical.*cabinet|three.*phase|switchgear|rectifier|capacitor|regulator/,
    },
    {
      service: 'Serrurier',
      aliases: ['Serrurerie'],
      pattern: /lock|key|door.*lock|safe|padlock|deadbolt|handle|knob|security.*door|keyhole|cylinder|door.*frame|latch|bolt|intercom|badge.*reader/,
    },
    {
      service: 'Ferronnier',
      aliases: ['Ferronnerie', 'Métallerie'],
      pattern: /iron.*gate|metal.*gate|wrought.*iron|railing|fence|iron.*door|steel.*door|grille|metal.*stair|balcony.*rail|iron.*work|forge|welding|metal.*frame|steel.*bar|iron.*fence/,
    },
    {
      service: 'Peintre',
      aliases: ['Peinture'],
      pattern: /paint|brush|roller|wall.*paint|paintbrush|palette|coat|primer|spray.*paint|decorator|wallpaper|paint.*can|paint.*bucket|scaffold|facade|interior.*paint/,
    },
    {
      service: 'Ménage',
      aliases: ['Nettoyage', 'Ménage Nettoyage'],
      pattern: /broom|vacuum|mop|dust|laundry|washing.*machine|detergent|sponge|bucket|cleaning|bleach|ironing|cloth|wipe|scrub|disinfect|cleaner|dustpan|glove.*cleaning/,
    },
    {
      service: 'Jardinier',
      aliases: ['Jardinage'],
      pattern: /grass|garden|tree|plant|leaf|lawn.*mower|mower|flower|soil|hedge|pruner|rake|hoe|fertilizer|bush|weed|shovel|trimmer|wheelbarrow|compost|irrigation|sprinkler/,
    },
    {
      service: 'Informatique',
      aliases: ['IT', 'Dépannage informatique'],
      pattern: /computer|laptop|screen|monitor|keyboard|mouse|network|router|server|software|tablet|phone.*repair|hard.*drive|processor|ram|usb|wifi|cable.*network|printer|data|cloud/,
    },
    {
      service: 'Climatisation',
      aliases: ['Climatisation Froid', 'CVC'],
      pattern: /air.*conditioner|air.*conditioning|cooling.*unit|ventilation|fan.*unit|heat.*pump|thermostat|duct|hvac|split.*system|indoor.*unit|outdoor.*unit|air.*handler/,
    },
    {
      service: 'Spécialiste Froid',
      aliases: ['Froid industriel', 'Réfrigération'],
      pattern: /refrigerator|fridge|freezer|cold.*room|refrigeration|cold.*storage|ice.*machine|compressor.*fridge|cooling.*system|chiller|condenser|evaporator|coolant|freon/,
    },
    {
      service: 'Chauffagiste',
      aliases: ['Chauffage', 'Plombier Chauffagiste'],
      pattern: /heater|heating|boiler|radiator|heat.*pump|underfloor.*heat|furnace|burner|gas.*heater|pellet.*stove|heat.*exchanger|hot.*water.*tank|central.*heating|thermostat.*heat/,
    },
    {
      service: 'Déménagement',
      aliases: ['Transport', 'Déménageur'],
      pattern: /truck|moving.*box|van|cardboard.*box|transport|packing|removal|furniture.*move|palette|forklift|trolley|bubble.*wrap|tape.*dispenser|storage.*unit/,
    },
    {
      service: 'Mécanique',
      aliases: ['Mécanique Automobile', 'Garagiste'],
      pattern: /car|wheel|engine|tire|tyre|motor|hood|bumper|brake|exhaust|radiator|battery.*car|windshield|axle|transmission|automotive|vehicle|oil.*change|jack|wrench.*car|garage/,
    },
    {
      service: 'Menuisier',
      aliases: ['Menuiserie', 'Charpentier'],
      pattern: /wood|carpenter|timber|plank|saw|chisel|woodwork|furniture.*making|cabinet.*making|wardrobe|shelf.*wood|door.*wood|parquet|flooring.*wood|beam|frame.*wood|joinery/,
    },
    {
      service: 'Carreleur',
      aliases: ['Carrelage'],
      pattern: /tile|tiling|grout|floor.*tile|wall.*tile|ceramic|mosaic|porcelain.*tile|tile.*cutter|adhesive.*tile|bathroom.*tile|kitchen.*tile|mortar.*tile|leveling.*tile/,
    },
    {
      service: 'Maçon',
      aliases: ['Maçonnerie', 'Gros œuvre'],
      pattern: /cement|concrete|brick|masonry|stone.*work|mortar|block.*wall|foundation|slab|rebar|shuttering|plaster.*wall|render|roughcast|facade.*stone|paving|cobblestone/,
    },
    {
      service: 'Staffeur',
      aliases: ['Stucateur', 'Plâtrier'],
      pattern: /plaster|stucco|gypsum|drywall|ceiling.*plaster|cornice|molding|partition.*wall|plasterboard|skim.*coat|interior.*finish|ornamental.*plaster|staff.*decoration/,
    },
    {
      service: 'Vitrier ALU',
      aliases: ['Vitrier', 'Menuiserie ALU', 'Double vitrage'],
      pattern: /window|glass|glazing|double.*glazing|aluminum.*frame|alu.*window|bay.*window|glass.*door|sliding.*door|glass.*panel|glazier|frame.*alu|velux|skylight|glass.*facade/,
    },
  ];

  /**
   * Scoring cumulatif : additionne les probabilités de toutes les prédictions
   * pour chaque service → bien plus robuste que de prendre uniquement le top 1
   */
  private interpretIntention(predictions: { className: string; probability: number }[]): string | null {
    if (!predictions || predictions.length === 0) return null;

    const scores: Record<string, number> = {};

    for (const prediction of predictions) {
      const label = prediction.className.toLowerCase();

      for (const { pattern, service } of this.SERVICE_MAP) {
        if (pattern.test(label)) {
          scores[service] = (scores[service] || 0) + prediction.probability;
        }
      }
    }

    console.log('Service scores:', scores);

    const sorted = Object.entries(scores).sort((a, b) => b[1] - a[1]);

    if (sorted.length === 0) {
      // Fallback : label brut si confiance suffisante
      const top = predictions[0];
      if (top.probability >= this.CONFIDENCE_THRESHOLD) {
        console.log(`No pattern matched — using raw label: "${top.className}"`);
        return top.className.split(',')[0].trim();
      }
      return null;
    }

    const [bestService, bestScore] = sorted[0];
    console.log(`✅ Best match: "${bestService}" | Cumulative score: ${(bestScore * 100).toFixed(1)}%`);

    return bestService;
  }

  /**
   * Recherche multi-termes : on essaie le service exact puis ses aliases
   * pour maximiser les chances de trouver quelque chose en base
   */
  private async searchWithFallback(intention: string) {
    const serviceEntry = this.SERVICE_MAP.find((s) => s.service === intention);
    const searchTerms = serviceEntry
      ? [intention, ...serviceEntry.aliases]
      : [intention];

    for (const term of searchTerms) {
      const results = await this.serviceService.findAll({
        query: term,
        page: 1,
        limit: 10,
      });

      if (results.data && results.data.length > 0) {
        console.log(`Found results with term: "${term}"`);
        return results;
      }
    }

    return { data: [] };
  }

  async searchByImage(file: Express.Multer.File) {
    if (!file) throw new Error('No file provided');
    if (!this.model) {
      throw new Error("Le service d'analyse d'image est actuellement hors ligne. Veuillez réessayer plus tard.");
    }

    try {
      const image = tf.node.decodeImage(file.buffer, 3);

      // Top 10 prédictions pour maximiser les chances de matcher
      const predictions = await this.model.classify(image as tf.Tensor3D, 10);
      console.log('Raw predictions:', predictions);
      image.dispose();

      const intention = this.interpretIntention(predictions);

      if (!intention) {
        return {
          data: [],
          isFallback: false,
          message: "Nous n'avons pas pu identifier le service lié à cette image. Essayez une photo plus nette ou décrivez votre besoin.",
          predictions,
        };
      }

      console.log(`IA Intention: "${intention}" | Top confidence: ${Math.round(predictions[0].probability * 100)}%`);

      const results = await this.searchWithFallback(intention);

      if (!results.data || results.data.length === 0) {
        return {
          data: [],
          isFallback: false,
          message: `Aucun prestataire trouvé pour "${intention}". Essayez de rechercher manuellement.`,
          predictions,
          intention,
        };
      }

      return {
        ...results,
        predictions,
        intention,
        message: `Service(s) trouvé(s) pour : ${intention}`,
      };
    } catch (error) {
      console.error('AI Image Search Error:', error);
      throw new Error("Erreur lors de l'analyse de l'image par l'IA.");
    }
  }


}