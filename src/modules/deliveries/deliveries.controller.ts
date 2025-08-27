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

@Controller("deliveries")
export class DeliveriesController {
  constructor(private readonly deliveriesService: DeliveriesService) {}

  @Get()
  @Roles(UserType.DELIVERY_AGENT)
  async fetchAvailableDeliveries(
    @Request() req,
    @Query("city") city?: string,
    @Query("maxRadius") maxRadius?: number,
    @Query("useProfile") useProfile?: boolean
  ) {
    const { userId } = req.user;

    return this.deliveriesService.findAvailableDeliveries(
      userId,
      city,
      maxRadius,
      useProfile
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
