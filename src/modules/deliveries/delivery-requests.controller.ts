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
import { CreateDeliveryRequestDto } from './dto/create-delivery-request.dto';
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
        const { customer_id } = req.user;

        if (!customer_id) {
            throw new HttpException('Customer not associated with this user', HttpStatus.BAD_REQUEST);
        }

        let parsedObjects;
        try {
            parsedObjects = JSON.parse(body.objects);
        } catch {
            throw new HttpException('Invalid objects format', HttpStatus.BAD_REQUEST);
        }

        parsedObjects.forEach((obj, index) => {
            obj.photo = files[index]?.filename || null;
        });

        const finalDto: CreateDeliveryRequestDto = {
            start_city: body.start_city,
            arrival_city: body.arrival_city,
            price: parseFloat(body.price),
            assurance: body.assurance === 'true',
            urgent: body.urgent === 'true',
            start_date: new Date(body.start_date),
            end_date: new Date(body.end_date),
            objects: parsedObjects,
        };

        return this.deliveryRequestsService.create(finalDto, customer_id);
    }
}
