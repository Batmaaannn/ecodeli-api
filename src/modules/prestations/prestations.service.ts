import { Injectable } from "@nestjs/common";
import { Prestation } from "./entities/prestations.entity";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";

@Injectable()
export class PrestationsService {
  constructor(
    @InjectRepository(Prestation)
    private readonly prestationsRepository: Repository<Prestation>
  ) {}
}
