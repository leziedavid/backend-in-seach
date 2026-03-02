export declare class GlobalDataMapper {
    mapUser(user: any): {
        id: any;
        email: any;
        phone: any;
        fullName: any;
        companyName: any;
        role: any;
        isPremium: any;
        credits: any;
        subscription: {
            id: any;
            plan: {
                id: any;
                name: any;
                price: any;
                serviceLimit: any;
                durationDays: any;
                isActive: any;
            } | null;
            startDate: any;
            endDate: any;
            status: any;
        } | null;
        createdAt: any;
        updatedAt: any;
    } | null;
    mapService(service: any): {
        id: any;
        title: any;
        code: any;
        description: any;
        type: any;
        status: any;
        price: any;
        frais: any;
        reduction: any;
        tags: any;
        location: any;
        latitude: any;
        longitude: any;
        imageUrls: any;
        files: any;
        images: any;
        userId: any;
        categoryId: any;
        category: {
            id: any;
            label: any;
            iconName: any;
        } | null;
        createdAt: any;
        updatedAt: any;
    } | null;
    mapAnnonce(annonce: any): {
        id: any;
        title: any;
        code: any;
        description: any;
        price: any;
        images: any;
        latitude: any;
        longitude: any;
        status: any;
        userId: any;
        typeId: any;
        categorieId: any;
        type: {
            id: any;
            label: any;
            slug: any;
        } | null;
        categorie: {
            id: any;
            label: any;
            slug: any;
            iconName: any;
        } | null;
        createdAt: any;
        updatedAt: any;
    } | null;
    mapBooking(booking: any): {
        id: any;
        clientId: any;
        code: any;
        providerId: any;
        serviceId: any;
        status: any;
        price: any;
        rating: any;
        comment: any;
        interventionType: any;
        scheduledDate: any;
        scheduledTime: any;
        description: any;
        userQrCode: any;
        prestaQrCode: any;
        client: {
            id: any;
            email: any;
            phone: any;
            fullName: any;
            companyName: any;
            role: any;
            isPremium: any;
            credits: any;
            subscription: {
                id: any;
                plan: {
                    id: any;
                    name: any;
                    price: any;
                    serviceLimit: any;
                    durationDays: any;
                    isActive: any;
                } | null;
                startDate: any;
                endDate: any;
                status: any;
            } | null;
            createdAt: any;
            updatedAt: any;
        } | null;
        provider: {
            id: any;
            email: any;
            phone: any;
            fullName: any;
            companyName: any;
            role: any;
            isPremium: any;
            credits: any;
            subscription: {
                id: any;
                plan: {
                    id: any;
                    name: any;
                    price: any;
                    serviceLimit: any;
                    durationDays: any;
                    isActive: any;
                } | null;
                startDate: any;
                endDate: any;
                status: any;
            } | null;
            createdAt: any;
            updatedAt: any;
        } | null;
        service: {
            id: any;
            title: any;
            code: any;
            description: any;
            type: any;
            status: any;
            price: any;
            frais: any;
            reduction: any;
            tags: any;
            location: any;
            latitude: any;
            longitude: any;
            imageUrls: any;
            files: any;
            images: any;
            userId: any;
            categoryId: any;
            category: {
                id: any;
                label: any;
                iconName: any;
            } | null;
            createdAt: any;
            updatedAt: any;
        } | null;
        images: any;
        createdAt: any;
        updatedAt: any;
    } | null;
    mapCollection(collection: any[], type: 'service' | 'annonce' | 'booking'): any[];
}
