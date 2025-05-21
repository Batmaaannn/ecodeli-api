import { Test, TestingModule } from "@nestjs/testing";
import { RegistrationRequestsController } from "./registration-requests.controller";

describe("RegistrationRequestsController", () => {
  let controller: RegistrationRequestsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [RegistrationRequestsController],
    }).compile();

    controller = module.get<RegistrationRequestsController>(
      RegistrationRequestsController
    );
  });

  it("should be defined", () => {
    expect(controller).toBeDefined();
  });
});
