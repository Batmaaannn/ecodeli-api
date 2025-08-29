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
  Patch,
} from "@nestjs/common";
import { DeliveriesService } from "./deliveries.service";
import { Roles } from "../auth/decorator/roles.decorator";
import { UserType } from "src/types/user";
import { UsersService } from "../users/users.service";
import { UpdateDeliveryDto } from "./dto/update-delivery.dto";
import { CreateRouteDto } from "./dto/create-route.dto";

@Roles(UserType.DELIVERY_AGENT)
@Controller("deliveries")
export class DeliveriesController {
  constructor(
    private readonly deliveriesService: DeliveriesService,
    private readonly usersService: UsersService
  ) {}

  // Deliveries

  @Get()
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

  @Get("details/:id")
  async getDelivery(@Param("id", ParseIntPipe) deliveryId: number) {
    return this.deliveriesService.getDelivery(deliveryId);
  }

  @Post("assign")
  async assignDeliveriesToAgent(
    @Request() req: any,
    @Body() updateDeliveryDto: UpdateDeliveryDto[]
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

  @Get("past")
  async fetchPastDeliveries(@Request() req) {
    const { userId } = req.user;

    const user = await this.usersService.findOneById(userId);
    if (!user.delivery_agent_id) {
      throw new HttpException(
        "User is not a delivery agent",
        HttpStatus.FORBIDDEN
      );
    }

    return this.deliveriesService.findPastDeliveries(user.delivery_agent_id);
  }

  @Get("active")
  async fetchActiveDeliveries(@Request() req) {
    const { userId } = req.user;

    const user = await this.usersService.findOneById(userId);
    if (!user.delivery_agent_id) {
      throw new HttpException(
        "User is not a delivery agent",
        HttpStatus.FORBIDDEN
      );
    }

    return this.deliveriesService.findActiveDeliveries(user.delivery_agent_id);
  }

  @Get("dashboard/stats")
  async getDashboardStats(@Request() req) {
    const { userId } = req.user;

    const user = await this.usersService.findOneById(userId);
    if (!user.delivery_agent_id) {
      throw new HttpException(
        "User is not a delivery agent",
        HttpStatus.FORBIDDEN
      );
    }

    return this.deliveriesService.getDashboardStats(user.delivery_agent_id);
  }

  @Get("dashboard/reviews")
  async getRecentReviews(@Request() req) {
    const { userId } = req.user;

    const user = await this.usersService.findOneById(userId);
    if (!user.delivery_agent_id) {
      throw new HttpException(
        "User is not a delivery agent",
        HttpStatus.FORBIDDEN
      );
    }

    return this.deliveriesService.getRecentReviews(user.delivery_agent_id);
  }

  @Patch("status/:id")
  async updateDeliveryStatus(@Param("id", ParseIntPipe) deliveryId: number) {
    return this.deliveriesService.updateDeliveryStatus(deliveryId);
  }

  // Routes

  @Get("trips")
  async getRoutes(@Request() req) {
    const { userId } = req.user;

    const user = await this.usersService.findOneById(userId);
    if (!user.delivery_agent_id) {
      throw new HttpException(
        "User is not a delivery agent",
        HttpStatus.FORBIDDEN
      );
    }

    return this.deliveriesService.getRoutesByAgentId(user.delivery_agent_id);
  }

  @Post("route")
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
  async deleteRoute(
    @Request() req,
    @Param("id", ParseIntPipe) routeId: number
  ) {
    return this.deliveriesService.deleteRouteById(routeId);
  }
}
