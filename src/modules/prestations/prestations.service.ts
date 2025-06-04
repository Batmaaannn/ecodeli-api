import { Injectable } from "@nestjs/common";
import { Prestation } from "./entities/prestations.entity";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { CreatePrestationDto } from "./dto/create-prestation.dto";

@Injectable()
export class PrestationsService {
  constructor(
    @InjectRepository(Prestation)
    private readonly prestationsRepository: Repository<Prestation>
  ) {}

  async create(createPrestationDto: CreatePrestationDto) {
    const prestation = this.prestationsRepository.create(createPrestationDto);
    return this.prestationsRepository.save(prestation);
  }

  /* Db requests */
  async findAll(): Promise<Prestation[]> {
    return this.prestationsRepository.find();
  }
}
