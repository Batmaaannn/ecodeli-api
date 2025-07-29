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

@Controller("deliveries")
export class DeliveriesController {
  constructor(private readonly deliveriesService: DeliveriesService) {}

  @Post("with-upload")
  @UseInterceptors()
  // FilesInterceptor("photos", 10, {
  //   storage: diskStorage({
  //     destination: "./uploads/delivery-objects",
  //     filename: (req, file, callback) => {
  //       const uniqueSuffix = uuid() + extname(file.originalname);
  //       callback(null, `${uniqueSuffix}`);
  //     },
  //   }),
  // })
  async createDeliveryWithImages(
    @Request() req,
    @UploadedFiles() files: Express.Multer.File[],
    @Body() body: any
  ) {
    const customer_id = req.user.userId;

    if (!customer_id) {
      throw new HttpException(
        "Customer not associated with this user",
        HttpStatus.BAD_REQUEST
      );
    }

    return this.deliveriesService.createWithFiles(body, files, customer_id);
  }
}
