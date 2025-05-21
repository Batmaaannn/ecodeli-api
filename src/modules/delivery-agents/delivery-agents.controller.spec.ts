import { Test, TestingModule } from '@nestjs/testing';
import { DeliveryAgentsController } from './delivery-agents.controller';

describe('DeliveryAgentsController', () => {
  let controller: DeliveryAgentsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [DeliveryAgentsController],
    }).compile();

    controller = module.get<DeliveryAgentsController>(DeliveryAgentsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
