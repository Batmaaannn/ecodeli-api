import { Body, Controller, Get, Post } from "@nestjs/common";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";
import { Public } from "../auth/decorator/public.decorator";
import { PrestationsService } from "./prestations.service";
import { Roles } from "../auth/decorator/roles.decorator";
import { UserType } from "src/types/user";
import { CreatePrestationDto } from "./dto/create-prestation.dto";

@ApiTags("prestations")
@Controller("prestations")
export class PrestationsController {
  constructor(private readonly prestationsService: PrestationsService) {}

  @Public()
  @Get()
  async getAllPrestations() {
    return this.prestationsService.findAll();
  }

  @ApiBearerAuth()
  @Roles(UserType.ADMIN)
  @Post("new-prestation")
  async createPrestation(@Body() createPrestationDto: CreatePrestationDto) {
    return this.prestationsService.create(createPrestationDto);
  }
}
