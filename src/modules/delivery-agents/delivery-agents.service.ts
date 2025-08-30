import { Injectable } from "@nestjs/common";
import { DeliveryAgent } from "./entities/delivery-agents.entity";
import { InjectRepository } from "@nestjs/typeorm";
import { Brackets, Repository } from "typeorm";
import { UsersService } from "../users/users.service";
import { UserType } from "src/types/user";
import { CreateUserDeliveryAgentDto } from "./dto/create-user-delivery-agent.dto";
import { FilesService } from "../files/files.service";
import { FileTargetType } from "src/types/file";
import {
  IPaginationOptions,
  paginate,
  Pagination,
} from "nestjs-typeorm-paginate";
import { OptionsFilters } from "src/types/db-requests";
import { File } from "../files/entities/file.entity";
import { UpdateUserDeliveryAgentDto } from "./dto/update-user-delivery-agent";
import { DeliveryAgentsSchedule } from "./entities/delivery-agents-schedule.entity";

@Injectable()
export class DeliveryAgentsService {
  constructor(
    @InjectRepository(DeliveryAgent)
    private readonly deliveryAgentsRepository: Repository<DeliveryAgent>,
    @InjectRepository(DeliveryAgentsSchedule)
    private readonly scheduleRepository: Repository<DeliveryAgentsSchedule>,
    private readonly usersService: UsersService,
    private readonly filesService: FilesService
  ) {}

  async createDeliveryAgent(createUserDto: CreateUserDeliveryAgentDto) {
    const {
      firstName,
      lastName,
      email,
      password,
      phoneNumber,
      companySiret,
      companyAddress,
      companyName,
      companyCity,
      files,
      licenseNumber,
      vehiculeType,
    } = createUserDto;

    const createdDeliveryAgent = await this.insertOne({
      first_name: firstName,
      last_name: lastName,
      phone_number: phoneNumber,
      siret: companySiret,
      company_address: companyAddress,
      company_name: companyName,
      company_city: companyCity,
      license_number: licenseNumber,
      vehicle_type: vehiculeType,
    });

    const insertedUser = await this.usersService.insertOneDeliveryAgent(
      {
        email,
        password,
        user_type: UserType.DELIVERY_AGENT,
      },
      createdDeliveryAgent
    );

    await this.updateOneById(insertedUser.delivery_agent.id, {
      user_id: insertedUser.id,
    });

    await this.filesService.createFile({
      files,
      targetId: createdDeliveryAgent.id,
      targetType: FileTargetType.DELIVERY_AGENT,
      userId: insertedUser.id,
    });
  }

  async getDeliveryAgents(
    options: OptionsFilters,
    optionsPaginate: IPaginationOptions
  ): Promise<Pagination<DeliveryAgent>> {
    return this.findManyDeliveryAgentsByFilters(options, optionsPaginate);
  }

  async getDeliveryAgentAndFilesById(
    id: number
  ): Promise<DeliveryAgent & { files: File[] }> {
    const deliveryAgent = await this.findOneByIdWithAllRelations(id);

    if (!deliveryAgent) {
      return null;
    }

    const files = await this.filesService.getFilesByTargetTypeAndId(
      FileTargetType.DELIVERY_AGENT,
      deliveryAgent.id
    );

    return {
      ...deliveryAgent,
      files: files || [],
    };
  }

  async updateDeliveryAgent(
    id: number,
    updateDeliveryAgentDto: Partial<UpdateUserDeliveryAgentDto>
  ) {
    const {
      firstName,
      lastName,
      email,
      phoneNumber,
      companyAddress,
      companyCity,
      vehiculeType,
      schedule,
      maxRadiusKm,
      favoriteDeliveryCity,
    } = updateDeliveryAgentDto;

    const deliveryAgentToUpdate = await this.findOneByIdWithAllRelations(id);
    if (!deliveryAgentToUpdate) {
      return null;
    }


    await this.usersService.updateOneById(deliveryAgentToUpdate.user.id, {
      email,
    });

    await this.updateOneById(deliveryAgentToUpdate.id, {
      first_name: firstName,
      last_name: lastName,
      phone_number: phoneNumber,
      company_address: companyAddress,
      company_city: companyCity,
      vehicle_type: vehiculeType,
      max_radius_km: +maxRadiusKm,
      favorite_delivery_city: favoriteDeliveryCity,
      has_completed_profile: true,
    });

    if (schedule) {
      await this.upsertSchedule(deliveryAgentToUpdate.id, schedule);
    }
    return this.findOneByIdWithAllRelations(deliveryAgentToUpdate.id);
  }

  /* Db requests */
  async findOne(id: number): Promise<DeliveryAgent> {
    return this.deliveryAgentsRepository.findOne({ where: { id } });
  }

  findOneBySiret(siret: string): Promise<DeliveryAgent> {
    return this.deliveryAgentsRepository.findOne({
      where: { siret },
    });
  }

  findOneByLicense(license: string): Promise<DeliveryAgent> {
    return this.deliveryAgentsRepository.findOne({
      where: { license_number: license },
    });
  }

  async findOneByIdWithAllRelations(id: number): Promise<DeliveryAgent> {
    return this.deliveryAgentsRepository.findOne({
      where: { id },
      relations: ["user"],
    });
  }

  async insertOne(
    deliveryAgentToCreate: Pick<
      DeliveryAgent,
      | "first_name"
      | "last_name"
      | "phone_number"
      | "siret"
      | "company_address"
      | "company_name"
      | "company_city"
      | "vehicle_type"
      | "license_number"
    >
  ) {
    const deliveryAgent = this.deliveryAgentsRepository.create(
      deliveryAgentToCreate
    );
    return this.deliveryAgentsRepository.save(deliveryAgent);
  }

  async updateOneById(
    id: number,
    dataToUpdate: Partial<DeliveryAgent>
  ): Promise<DeliveryAgent> {
    await this.deliveryAgentsRepository.update(id, dataToUpdate);

    return this.deliveryAgentsRepository.findOne({ where: { id } });
  }

  async findManyDeliveryAgentsByFilters(
    options: OptionsFilters,
    optionsPaginate: IPaginationOptions
  ): Promise<Pagination<DeliveryAgent>> {
    const queryBuilder =
      this.deliveryAgentsRepository.createQueryBuilder("deliveryAgent");

    queryBuilder
      .leftJoinAndSelect("deliveryAgent.user", "user")
      .groupBy("deliveryAgent.id")
      .addGroupBy("user.id");

    if (options.activated) {
      queryBuilder.andWhere(
        new Brackets((qb) => {
          qb.where("user.is_activated = :activated", {
            activated: options.activated,
          });
        })
      );
    }

    if (options.sort) {
      const splitSortAndValue = options.sort.split(/([x^+-])/g);
      if (splitSortAndValue[1] === "+") {
        queryBuilder.orderBy(splitSortAndValue[2], "ASC");
      } else {
        queryBuilder.orderBy(splitSortAndValue[2], "DESC");
      }
    }

    return await paginate<DeliveryAgent>(queryBuilder, optionsPaginate);
  }

  private async upsertSchedule(deliveryAgentId: number, schedule: any) {
    const daysMap = {
      monday: 1,
      tuesday: 2,
      wednesday: 3,
      thursday: 4,
      friday: 5,
      saturday: 6,
      sunday: 0,
    };

    for (const [dayName, dayNumber] of Object.entries(daysMap)) {
      const daySchedule = schedule[dayName];
      if (!daySchedule) continue;

      const existingSchedule = await this.scheduleRepository.findOne({
        where: {
          delivery_agent_id: deliveryAgentId,
          day: dayNumber,
        },
      });

      const scheduleData = {
        delivery_agent_id: deliveryAgentId,
        day: dayNumber,
        full_day: daySchedule.isWorking,
        morning_start: daySchedule.morning?.isActive
          ? daySchedule.morning.start
          : "08:30",
        morning_end: daySchedule.morning?.isActive
          ? daySchedule.morning.end
          : "13:00",
        afternoon_start: daySchedule.afternoon?.isActive
          ? daySchedule.afternoon.start
          : "13:00",
        afternoon_end: daySchedule.afternoon?.isActive
          ? daySchedule.afternoon.end
          : "17:30",
      };

      if (existingSchedule) {
        await this.scheduleRepository.update(existingSchedule.id, scheduleData);
      } else {
        await this.scheduleRepository.save(scheduleData);
      }
    }
  }
}
