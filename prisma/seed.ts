import { PrismaClient, Role, ServiceType, SubscriptionStatus, BookingStatus } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function clearDatabase() {
    console.log('Clearing database...');
    // Delete in reverse order of dependencies
    await prisma.annonce.deleteMany();
    await prisma.categorieAnnonce.deleteMany();
    await prisma.typeAnnonce.deleteMany();
    await prisma.booking.deleteMany();
    await prisma.service.deleteMany();
    await prisma.category.deleteMany();
    await prisma.subscription.deleteMany();
    await prisma.subscriptionPlan.deleteMany();
    await prisma.user.deleteMany();
}

function generateSeedCode(prefix: string): string {
    return `${prefix}-${Math.random().toString(36).substr(2, 6).toUpperCase()}`;
}

async function main() {
    await clearDatabase();

    const password = await bcrypt.hash('@1234', 10);

    // 1. Create Subscription Plans
    const plans = [
        {
            name: 'FREE',
            price: 0,
            serviceLimit: 5,
            durationDays: 3650,
            isActive: true,
        },
        {
            name: 'PREMIUM',
            price: 29,
            serviceLimit: 999999, // Unlimited
            durationDays: 30,
            isActive: true,
        },
    ];

    for (const plan of plans) {
        await prisma.subscriptionPlan.upsert({
            where: { name: plan.name },
            update: {},
            create: plan,
        });
    }
    const dbPlans = await prisma.subscriptionPlan.findMany();
    const freePlan = dbPlans.find((p) => p.name === 'FREE')!;
    const premiumPlan = dbPlans.find((p) => p.name === 'PREMIUM')!;

    // 2. Create Admin
    const admin = await prisma.user.upsert({
        where: { email: 'admin@market.com' },
        update: {},
        create: {
            email: 'admin@market.com',
            fullName: 'Admin User',
            phone: '0000000000',
            password,
            role: Role.ADMIN,
            isPremium: true,
        },
    });

    // 3. Create Categories
    const categoriesData = [
        { label: 'Plombier', iconName: 'map-pin' },
        { label: 'Electricien', iconName: 'zap' },
        { label: 'Serrurier', iconName: 'key' },
        { label: 'Peintre', iconName: 'paint-brush' },
        { label: 'Ménage', iconName: 'broom' },
        { label: 'Jardinier', iconName: 'leaf' },
        { label: 'Informatique', iconName: 'monitor' },
        { label: 'Climatisation', iconName: 'wind' },
        { label: 'Déménagement', iconName: 'truck' },
        { label: 'Mécanique', iconName: 'car' },
        { label: 'Electrotechnicien', iconName: 'phone' },
        { label: 'Ferronnier', iconName: 'wrench' },
        { label: 'Jardinier', iconName: 'tree' },
        { label: 'Menuisier', iconName: 'hammer' },
        { label: 'Carreleur', iconName: 'tile' },
        { label: 'Chauffagiste', iconName: 'thermometer' },
        { label: 'Maçon', iconName: 'brick' },
        { label: 'Staffeur', iconName: 'plaster' },
        { label: 'Vitrier ALU', iconName: 'window' },
        { label: 'Serrurier', iconName: 'lock' },
        { label: 'Spécialiste Froid', iconName: 'snowflake' },

    ];

    for (const cat of categoriesData) {
        await prisma.category.upsert({
            where: { label: cat.label },
            update: {},
            create: cat,
        });
    }
    const dbCategories = await prisma.category.findMany();

    // 4. Create Clients (5)
    const clients = [];
    for (let i = 1; i <= 5; i++) {
        const user = await prisma.user.upsert({
            where: { email: `client${i}@example.com` },
            update: {},
            create: {
                email: `client${i}@example.com`,
                fullName: `Client ${i}`,
                phone: `010203040${i}`,
                password,
                role: Role.CLIENT,
                credits: 100, // Give some starting credits
            },
        });
        clients.push(user);
    }

    // 5. Create Prestataires (8)
    const prestataires = [];
    for (let i = 1; i <= 8; i++) {
        const isPremium = i <= 3; // First 3 are premium
        const prestataire = await prisma.user.upsert({
            where: { email: `pro${i}@example.com` },
            update: {},
            create: {
                email: `pro${i}@example.com`,
                fullName: `Provider ${i}`,
                phone: `020304050${i}`,
                password,
                role: Role.PRESTATAIRE,
                isPremium: isPremium,
                subscription: isPremium ? {
                    create: {
                        planId: premiumPlan.id,
                        endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
                        status: SubscriptionStatus.ACTIVE,
                    }
                } : undefined
            },
        });
        prestataires.push(prestataire);
    }

    // 6. Create Services (30)
    const services = [];
    const serviceTypes = [ServiceType.DEPANNAGE, ServiceType.LOCATION, ServiceType.VENTE];

    for (let i = 1; i <= 30; i++) {
        const provider = prestataires[Math.floor(Math.random() * prestataires.length)];
        const category = dbCategories[Math.floor(Math.random() * dbCategories.length)];

        // Coordinates around a central point (e.g., Paris logic or similar)
        // 48.8566° N, 2.3522° E
        const lat = 48.8566 + (Math.random() - 0.5) * 0.1;
        const lng = 2.3522 + (Math.random() - 0.5) * 0.1;

        const price = Math.floor(Math.random() * 200) + 50;
        const frais = Math.floor(price * 0.8); // Estimated price is 80% of final price

        const service = await prisma.service.create({
            data: {
                title: `${category.label} - Intervention ${i}`,
                description: `Besoin d'un expert en ${category.label} ? Nous intervenons rapidement pour tout type de problème. Service de qualité garanti avec une expérience de plus de 10 ans dans le domaine. Disponible 7j/7 pour les urgences.`,
                type: serviceTypes[Math.floor(Math.random() * serviceTypes.length)],
                latitude: lat,
                longitude: lng,
                frais: frais,
                price: price,
                userId: provider.id,
                categoryId: category.id,
                code: generateSeedCode('SV'),
                imageUrls: ['https://images.unsplash.com/photo-1581092160562-40aa08e78837?q=80&w=2070&auto=format&fit=crop'],
            },
        });
        services.push(service);
    }

    // 7. Create Bookings (15)
    for (let i = 1; i <= 15; i++) {
        const client = clients[Math.floor(Math.random() * clients.length)];
        const service = services[Math.floor(Math.random() * services.length)];
        const statusArray = [
            BookingStatus.PENDING,
            BookingStatus.ACCEPTED,
            BookingStatus.IN_PROGRESS,
            BookingStatus.COMPLETED,
            BookingStatus.PAID,
            BookingStatus.CANCELLED
        ];
        const status = statusArray[Math.floor(Math.random() * statusArray.length)];

        await prisma.booking.create({
            data: {
                clientId: client.id,
                providerId: service.userId,
                serviceId: service.id,
                status: status,
                price: Math.floor(Math.random() * 200) + 50,
                rating: status === BookingStatus.COMPLETED || status === BookingStatus.PAID ? Math.floor(Math.random() * 2) + 4 : null,
                comment: status === BookingStatus.COMPLETED || status === BookingStatus.PAID ? 'Excellent service, très professionnel !' : null,
                scheduledDate: new Date(Date.now() + Math.floor(Math.random() * 7) * 24 * 60 * 60 * 1000), // Random date in next 7 days
                scheduledTime: `${Math.floor(Math.random() * 10) + 8}:00`, // Random hour 8-17
                interventionType: Math.random() > 0.5 ? 'RDV' : 'URGENCE',
                userQrCode: `USER-${Math.random().toString(36).substr(2, 9).toUpperCase()}`,
                prestaQrCode: `PRESTA-${Math.random().toString(36).substr(2, 9).toUpperCase()}`,
                code: generateSeedCode('BK'),
            },
        });
    }

    // 8. Create TypeAnnonce
    const typeAnnoncesData = [
        { label: 'Vente', slug: 'vente' },
        { label: 'Location', slug: 'location' },
        { label: 'Réservation', slug: 'reservation' },
    ];

    for (const type of typeAnnoncesData) {
        await prisma.typeAnnonce.upsert({
            where: { label: type.label },
            update: {},
            create: type,
        });
    }
    const dbTypeAnnonces = await prisma.typeAnnonce.findMany();

    // 9. Create CategorieAnnonce
    const catAnnoncesData = [
        { label: 'Toutes', slug: 'toutes' },
        { label: 'Concert', slug: 'concert' },
        { label: 'Culture', slug: 'culture' },
        { label: 'Formation', slug: 'formation' },
        { label: 'Soirée', slug: 'soiree' },
        { label: 'Tourisme', slug: 'tourisme' },
        { label: 'Sport', slug: 'sport' },
        { label: 'Festival', slug: 'festival' },
        { label: 'Science', slug: 'science' },
        { label: 'Religieux', slug: 'religieux' },
        { label: 'Gastronomie', slug: 'gastronomie' },
        { label: 'Business', slug: 'business' },
        { label: 'Autre', slug: 'autre' },
    ];

    for (const cat of catAnnoncesData) {
        await prisma.categorieAnnonce.upsert({
            where: { label: cat.label },
            update: {},
            create: cat,
        });
    }
    const dbCatAnnonces = await prisma.categorieAnnonce.findMany();

    // 10. Create Annonces (20)
    const availableOptions = [
        'Télévision',
        'Parking',
        'Climatisation',
        'Cuisine équipée',
        'Garage',
        'Wi-Fi',
        'Piscine',
        'Jardin',
        'Ascenseur',
        'Gardien'
    ];

    for (let i = 1; i <= 20; i++) {
        const user = prestataires[Math.floor(Math.random() * prestataires.length)];
        const category = dbCatAnnonces[Math.floor(Math.random() * dbCatAnnonces.length)];
        const type = dbTypeAnnonces[Math.floor(Math.random() * dbTypeAnnonces.length)];

        const lat = 48.8566 + (Math.random() - 0.5) * 0.1;
        const lng = 2.3522 + (Math.random() - 0.5) * 0.1;

        // Pick 3-5 random options
        const numOptions = Math.floor(Math.random() * 3) + 3;
        const shuffeledOptions = [...availableOptions].sort(() => 0.5 - Math.random());
        const selectedOptions = shuffeledOptions.slice(0, numOptions);

        await prisma.annonce.create({
            data: {
                title: `Annonce ${category.label} - ${type.label} ${i}`,
                description: `Ceci est une superbe annonce pour ${category.label} en mode ${type.label}. Ne manquez pas cette opportunité unique ! Contactez-nous pour plus d'informations.`,
                price: Math.floor(Math.random() * 1000) + 10,
                latitude: lat,
                longitude: lng,
                userId: user.id,
                typeId: type.id,
                categorieId: category.id,
                images: ['https://images.unsplash.com/photo-1540575467063-178a50c2df87?q=80&w=2070&auto=format&fit=crop'],
                options: selectedOptions,
                status: 'ACTIVE',
                code: generateSeedCode('AN'),
            },
        });
    }

    console.log('Seed completed successfully!');
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
