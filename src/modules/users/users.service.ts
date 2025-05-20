import { forwardRef, Inject, Injectable } from "@nestjs/common";
import { AuthService } from "../auth/auth.service";
import { InjectRepository } from "@nestjs/typeorm";
import { User } from "./entities/user.entity";
import { Repository } from "typeorm";

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  async getMyUser(id: number | string) {
    return this.findOneByIdWithAllRelations(+id);
  }

  async getUser(id: number | string): Promise<Omit<User, "password">> {
    return this.findOneById(+id);
  }

  /* Db requests */
  async findOneById(id: number): Promise<User> {
    return this.usersRepository.findOne({ where: { id } });
  }

  async findOneByEmail(email: string): Promise<User> {
    return this.usersRepository.findOne({ where: { email } });
  }

  async findOneByIdWithAllRelations(id: number) {
    return this.usersRepository.findOne({
      where: { id },
    });
  }
}
