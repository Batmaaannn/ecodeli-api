import { Module } from '@nestjs/common';
import { DeliveryAgentsController } from './delivery-agents.controller';

@Module({
  controllers: [DeliveryAgentsController]
})
export class DeliveryAgentsModule {}
