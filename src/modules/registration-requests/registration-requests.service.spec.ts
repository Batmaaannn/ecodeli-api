import { Test, TestingModule } from "@nestjs/testing";
import { RegistrationRequestsService } from "./registration-requests.service";

describe("RegistrationRequestsService", () => {
  let service: RegistrationRequestsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [RegistrationRequestsService],
    }).compile();

    service = module.get<RegistrationRequestsService>(
      RegistrationRequestsService
    );
  });

  it("should be defined", () => {
    expect(service).toBeDefined();
  });
});
