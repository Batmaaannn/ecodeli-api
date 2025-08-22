import {
  Controller,
  Post,
  UploadedFiles,
  UseInterceptors,
  Body,
  Request,
  HttpException,
  HttpStatus,
} from "@nestjs/common";
import { DeliveriesService } from "./deliveries.service";
import { FilesInterceptor } from "@nestjs/platform-express";

@Controller("deliveries")
export class DeliveriesController {
  constructor(private readonly deliveriesService: DeliveriesService) {}

}
