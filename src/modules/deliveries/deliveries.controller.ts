import {
  Controller,
  Post,
  UploadedFiles,
  UseInterceptors,
  Body,
  Request,
  HttpException,
  HttpStatus,
  Get,
} from "@nestjs/common";
import { DeliveriesService } from "./deliveries.service";
import { FilesInterceptor } from "@nestjs/platform-express";
import { Roles } from "../auth/decorator/roles.decorator";
import { UserType } from "src/types/user";

@Controller("deliveries")
export class DeliveriesController {
  constructor(private readonly deliveriesService: DeliveriesService) {}

  @Get("posted")
  @Roles(UserType.DELIVERY_AGENT)
  async fetchPostedDeliveries() {
    return this.deliveriesService.findAllPosted();
  }
}
