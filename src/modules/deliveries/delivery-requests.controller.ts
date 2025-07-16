import {
    Controller,
    Post,
    UploadedFiles,
    UseInterceptors,
    Body,
    Request,
    HttpException,
    HttpStatus,
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { v4 as uuid } from 'uuid';
import { extname } from 'path';
import { DeliveryRequestsService } from './delivery-requests.service';

@Controller('delivery-requests')
export class DeliveryRequestsController {
    constructor(private readonly deliveryRequestsService: DeliveryRequestsService) {}

    @Post('with-upload')
    @UseInterceptors(
        FilesInterceptor('photos', 10, {
            storage: diskStorage({
                destination: './uploads/delivery-objects',
                filename: (req, file, callback) => {
                    const uniqueSuffix = uuid() + extname(file.originalname);
                    callback(null, `${uniqueSuffix}`);
                },
            }),
        }),
    )
    async createDeliveryWithImages(
        @Request() req,
        @UploadedFiles() files: Express.Multer.File[],
        @Body() body: any,
    ) {
        const customer_id = req.user.userId;

        if (!customer_id) {
            throw new HttpException('Customer not associated with this user', HttpStatus.BAD_REQUEST);
        }

        return this.deliveryRequestsService.createWithFiles(body, files, customer_id);
    }

}
