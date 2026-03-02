import { BookingStatus, InterventionType } from '@prisma/client';
export declare class CreateBookingDto {
    serviceId: string;
    interventionType: InterventionType;
    scheduledDate: Date;
    scheduledTime: string;
    description?: string;
}
export declare class UpdateBookingStatusDto {
    status: BookingStatus;
}
export declare class ScanQrDto {
    qrCode: string;
}
