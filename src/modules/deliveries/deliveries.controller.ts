import {
  Controller,
  Request,
  Get,
  Query,
  Post,
  Param,
  ParseIntPipe,
  Body,
  HttpStatus,
  HttpException,
  Delete,
} from "@nestjs/common";
import { DeliveriesService } from "./deliveries.service";
import { Roles } from "../auth/decorator/roles.decorator";
import { UserType } from "src/types/user";
import { UsersService } from "../users/users.service";
import { UpdateDeliveryDto } from "./dto/update-delivery.dto";
import { CreateRouteDto } from "./dto/create-route.dto";

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
    if (!user.delivery_agent_id) {
      throw new HttpException(
        "User is not a delivery agent",
        HttpStatus.FORBIDDEN
      );
    }

    return this.deliveriesService.findAvailableDeliveries(
      user.delivery_agent_id,
      city,
      maxRadius
    );
  }

  @Post("assign")
  @Roles(UserType.DELIVERY_AGENT)
  async assignDeliveriesToAgent(
    @Request() req: any,
    @Body("deliveryIds") updateDeliveryDto: UpdateDeliveryDto[]
  ) {
    const { userId } = req.user;

    const user = await this.usersService.findOneById(userId);
    if (!user.delivery_agent_id) {
      throw new HttpException(
        "User is not a delivery agent",
        HttpStatus.FORBIDDEN
      );
    }

    return this.deliveriesService.assignDeliveriesToAgent(
      updateDeliveryDto,
      user.delivery_agent_id
    );
  }

  @Get("trips")
  @Roles(UserType.DELIVERY_AGENT)
  async getRoutes(@Request() req) {
    const { userId } = req.user;

    const user = await this.usersService.findOneById(userId);
    if (!user.delivery_agent_id) {
      throw new HttpException(
        "User is not a delivery agent",
        HttpStatus.FORBIDDEN
      );
    }

    return this.deliveriesService.getRoutesByAgentId(
      user.delivery_agent_id
    );
  }

  @Post("route")
  @Roles(UserType.DELIVERY_AGENT)
  async createRoute(@Request() req, @Body() createRouteDto: CreateRouteDto) {
    const { userId } = req.user;

    const user = await this.usersService.findOneById(userId);
    if (!user.delivery_agent_id) {
      throw new HttpException(
        "User is not a delivery agent",
        HttpStatus.FORBIDDEN
      );
    }

    return this.deliveriesService.createRoute(
      createRouteDto,
      user.delivery_agent_id
    );
  }

  @Delete("route/:id")
  @Roles(UserType.DELIVERY_AGENT)
  async deleteRoute(
    @Request() req,
    @Param("id", ParseIntPipe) routeId: number
  ) {
    return this.deliveriesService.deleteRouteById(routeId);
  }
}
