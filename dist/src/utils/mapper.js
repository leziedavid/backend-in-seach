"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GlobalDataMapper = void 0;
const common_1 = require("@nestjs/common");
let GlobalDataMapper = class GlobalDataMapper {
    mapUser(user) {
        if (!user)
            return null;
        return {
            id: user.id,
            email: user.email,
            phone: user.phone,
            fullName: user.fullName,
            companyName: user.companyName,
            role: user.role,
            isPremium: user.isPremium || false,
            credits: user.credits || 0,
            subscription: user.subscription
                ? {
                    id: user.subscription.id,
                    plan: user.subscription.plan
                        ? {
                            id: user.subscription.plan.id,
                            name: user.subscription.plan.name,
                            price: user.subscription.plan.price,
                            serviceLimit: user.subscription.plan.serviceLimit,
                            durationDays: user.subscription.plan.durationDays,
                            isActive: user.subscription.plan.isActive,
                        }
                        : null,
                    startDate: user.subscription.startDate,
                    endDate: user.subscription.endDate,
                    status: user.subscription.status,
                }
                : null,
            createdAt: user.createdAt,
            updatedAt: user.updatedAt,
        };
    }
    mapService(service) {
        if (!service)
            return null;
        const files = service.files?.map((f) => f.fileUrl) || [];
        const imageUrls = service.imageUrls || [];
        const images = files.length > 0 ? files : imageUrls.length > 0 ? imageUrls : [];
        return {
            id: service.id,
            title: service.title,
            code: service.code,
            description: service.description,
            type: service.type,
            status: service.status,
            price: service.price,
            frais: service.frais,
            reduction: service.reduction || 0,
            tags: service.tags || [],
            location: service.location,
            latitude: service.latitude,
            longitude: service.longitude,
            imageUrls,
            files,
            images,
            userId: service.userId,
            categoryId: service.categoryId,
            category: service.category
                ? {
                    id: service.category.id,
                    label: service.category.label,
                    iconName: service.category.iconName,
                }
                : null,
            createdAt: service.createdAt,
            updatedAt: service.updatedAt,
        };
    }
    mapAnnonce(annonce) {
        if (!annonce)
            return null;
        const files = annonce.files?.map((f) => f.fileUrl) || [];
        const images = files.length > 0 ? files : annonce.images || [];
        return {
            id: annonce.id,
            title: annonce.title,
            code: annonce.code,
            description: annonce.description,
            price: annonce.price,
            images,
            latitude: annonce.latitude,
            longitude: annonce.longitude,
            status: annonce.status,
            userId: annonce.userId,
            typeId: annonce.typeId,
            categorieId: annonce.categorieId,
            type: annonce.type
                ? {
                    id: annonce.type.id,
                    label: annonce.type.label,
                    slug: annonce.type.slug,
                }
                : null,
            categorie: annonce.categorie
                ? {
                    id: annonce.categorie.id,
                    label: annonce.categorie.label,
                    slug: annonce.categorie.slug,
                    iconName: annonce.categorie.iconName,
                }
                : null,
            createdAt: annonce.createdAt,
            updatedAt: annonce.updatedAt,
        };
    }
    mapBooking(booking) {
        if (!booking)
            return null;
        const files = booking.files?.map((f) => f.fileUrl) || [];
        return {
            id: booking.id,
            clientId: booking.clientId,
            code: booking.code,
            providerId: booking.providerId,
            serviceId: booking.serviceId,
            status: booking.status,
            price: booking.price,
            rating: booking.rating,
            comment: booking.comment,
            interventionType: booking.interventionType,
            scheduledDate: booking.scheduledDate,
            scheduledTime: booking.scheduledTime,
            description: booking.description,
            userQrCode: booking.userQrCode,
            prestaQrCode: booking.prestaQrCode,
            client: this.mapUser(booking.client),
            provider: this.mapUser(booking.provider),
            service: this.mapService(booking.service),
            images: files,
            createdAt: booking.createdAt,
            updatedAt: booking.updatedAt,
        };
    }
    mapCollection(collection, type) {
        if (!collection)
            return [];
        return collection.map((item) => {
            if (type === 'service')
                return this.mapService(item);
            if (type === 'annonce')
                return this.mapAnnonce(item);
            if (type === 'booking')
                return this.mapBooking(item);
            return item;
        });
    }
};
exports.GlobalDataMapper = GlobalDataMapper;
exports.GlobalDataMapper = GlobalDataMapper = __decorate([
    (0, common_1.Injectable)()
], GlobalDataMapper);
//# sourceMappingURL=mapper.js.map