import {
  Controller,
  Request,
  Get,
  Query,
  Post,
  Param,
  ParseIntPipe,
} from "@nestjs/common";
import { DeliveriesService } from "./deliveries.service";
import { Roles } from "../auth/decorator/roles.decorator";
import { UserType } from "src/types/user";
import { UsersService } from "../users/users.service";

@Controller("deliveries")
export class DeliveriesController {
  constructor(
    private readonly deliveriesService: DeliveriesService,
    private readonly usersService: UsersService
  ) {}

  @Get()
  @Roles(UserType.DELIVERY_AGENT)
  async fetchAvailableDeliveries(
    @Request() req,
    @Query("city") city?: string,
    @Query("maxRadius") maxRadius?: number
  ) {
    const { userId } = req.user;

    const user = await this.usersService.findOneById(userId);

    return this.deliveriesService.findAvailableDeliveries(
      user.delivery_agent_id,
      city,
      maxRadius
    );
  }

  @Post(":deliveryId/assign")
  @Roles(UserType.DELIVERY_AGENT)
  async assignDeliveryToAgent(
    @Request() req: any,
    @Param("deliveryId", ParseIntPipe) deliveryId: number
  ) {
    const { userId } = req.user;

    return this.deliveriesService.assignDeliveryToAgent(deliveryId, userId);
  }
}
