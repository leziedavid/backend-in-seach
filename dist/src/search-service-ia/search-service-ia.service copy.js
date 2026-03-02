"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SearchServiceIaService = void 0;
const common_1 = require("@nestjs/common");
const tf = require("@tensorflow/tfjs-node");
const mobilenet = require("@tensorflow-models/mobilenet");
const service_service_1 = require("../service/service.service");
let SearchServiceIaService = class SearchServiceIaService {
    serviceService;
    model;
    CONFIDENCE_THRESHOLD = 0.85;
    constructor(serviceService) {
        this.serviceService = serviceService;
    }
    async onModuleInit() {
        console.log('Loading MobileNet model...');
        this.model = await mobilenet.load();
        console.log('MobileNet model loaded.');
    }
    interpretIntention(predictions) {
        if (!predictions || predictions.length === 0)
            return null;
        const topPrediction = predictions[0];
        if (topPrediction.probability < this.CONFIDENCE_THRESHOLD) {
            console.log(`Confidence too low: ${topPrediction.probability * 100}% < 50%`);
            return null;
        }
        const labels = predictions.map((p) => p.className.toLowerCase()).join(' ');
        if (labels.match(/pipe|faucet|plumber|sink|washbasin|water|drain|plunger/))
            return 'Plomberie';
        if (labels.match(/wire|electrical|outlet|switch|bulb|light|electricity|power/))
            return 'Électricité';
        if (labels.match(/hammer|screw|tool|drill|wood|carpenter|wrench|pliers/))
            return 'Bricolage Menuiserie';
        if (labels.match(/car|wheel|engine|automotive|tire|motor|mechanic/))
            return 'Mécanique Automobile';
        if (labels.match(/computer|laptop|screen|keyboard|mouse|network|internet|software/))
            return 'Informatique';
        if (labels.match(/clean|broom|vacuum|mop|dust|laundry|wash/))
            return 'Ménage Nettoyage';
        if (labels.match(/grass|garden|tree|plant|leaf|mower|flower/))
            return 'Jardinage';
        if (labels.match(/air conditioner|cooling|refrigerator|fridge|heater|hvac/))
            return 'Climatisation Froid';
        if (labels.match(/lock|key|door|safe|security/))
            return 'Serrurerie';
        if (labels.match(/paint|brush|roller|wall|decoration/))
            return 'Peinture';
        if (labels.match(/truck|box|moving|van|transport/))
            return 'Déménagement';
        return topPrediction.className.split(',')[0].trim();
    }
    async searchByImage(file) {
        if (!file)
            throw new Error('No file provided');
        try {
            const image = tf.node.decodeImage(file.buffer);
            const predictions = await this.model.classify(image, 5);
            console.log('Predictions:', predictions);
            image.dispose();
            const intention = this.interpretIntention(predictions);
            if (!intention) {
                return {
                    data: [],
                    isFallback: false,
                    message: 'Nous n’avons pas trouvé de service correspondant à cette image. Veuillez réessayer ou saisir le nom du service.',
                    predictions,
                };
            }
            console.log(`IA Intention Identified: "${intention}" (Confidence: ${Math.round(predictions[0].probability * 100)}%)`);
            const results = await this.serviceService.findAll({
                query: intention,
                page: 1,
                limit: 10,
            });
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
        }
        catch (error) {
            console.error('AI Image Search Error:', error);
            throw new Error("Erreur lors de l'analyse de l'image par l'IA.");
        }
    }
};
exports.SearchServiceIaService = SearchServiceIaService;
exports.SearchServiceIaService = SearchServiceIaService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [service_service_1.ServiceService])
], SearchServiceIaService);
//# sourceMappingURL=search-service-ia.service%20copy.js.map