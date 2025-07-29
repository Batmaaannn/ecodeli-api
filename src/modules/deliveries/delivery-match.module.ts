import { Module } from '@nestjs/common';
import { DeliveryMatchService } from './delivery-match.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DeliveryRequest } from './entities/delivery-request.entity';
import { Trip } from 'src/modules/trip/entities/trip.entity';

@Module({
    imports: [
        TypeOrmModule.forFeature([DeliveryRequest, Trip]),
    ],
    providers: [DeliveryMatchService],
    exports: [DeliveryMatchService],
})
export class DeliveryMatchModule {}
