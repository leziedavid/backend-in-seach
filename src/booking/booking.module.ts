import { Module } from '@nestjs/common';
import { BookingService } from './booking.service';
import { BookingController } from './booking.controller';
import { SocketModule } from '../socket/socket.module';
import { PaymentModule } from '../payment/payment.module';

@Module({
  imports: [SocketModule, PaymentModule],
  controllers: [BookingController],
  providers: [BookingService],
})
export class BookingModule {}
