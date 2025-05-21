import { Test, TestingModule } from '@nestjs/testing';
import { DeliveryAgentsService } from './delivery-agents.service';

describe('DeliveryAgentsService', () => {
  let service: DeliveryAgentsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [DeliveryAgentsService],
    }).compile();

    service = module.get<DeliveryAgentsService>(DeliveryAgentsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
