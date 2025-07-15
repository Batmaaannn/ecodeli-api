import {
    Body,
    Controller,
    Get,
    Post,
    Request,
    HttpException,
    HttpStatus,
} from "@nestjs/common";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";
import { DeliveryRequestsService } from "./delivery-requests.service";
import { CreateDeliveryRequestDto } from "./dto/create-delivery-request.dto";
import { Roles } from "../auth/decorator/roles.decorator";
import { UserType } from "src/types/user";

@ApiBearerAuth()
@ApiTags("delivery-requests")
@Controller("delivery-requests")
export class DeliveryRequestsController {
    constructor(private readonly deliveryRequestsService: DeliveryRequestsService) {}

    @Roles(UserType.CUSTOMER)
    @Post()
    async createDeliveryRequest(
        @Request() req,
        @Body() createDeliveryDto: CreateDeliveryRequestDto
    ) {
        const { customer_id } = req.user;

        if (!customer_id) {
            throw new HttpException(
                "Customer not associated with this user",
                HttpStatus.BAD_REQUEST
            );
        }

        return this.deliveryRequestsService.create(createDeliveryDto, customer_id);
    }

    @Roles(UserType.ADMIN)
    @Get()
    async getAllRequests() {
        return this.deliveryRequestsService.findAll();
    }
}
