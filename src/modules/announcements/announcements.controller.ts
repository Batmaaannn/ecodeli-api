import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  HttpStatus,
  HttpCode,
  Request,
} from "@nestjs/common";
import {
  AnnouncementsService,
  UpdateAnnouncementDto,
} from "./announcements.service";
import { AnnouncementStatus } from "src/types/announcement";
import { CreateAnnouncementDto } from "./dto/create-announcement.dto";
import { FormDataRequest } from "nestjs-form-data";
import { Roles } from "../auth/decorator/roles.decorator";
import { UserType } from "src/types/user";
import { UsersService } from "../users/users.service";

@Controller("announcements")
export class AnnouncementsController {
  constructor(
    private readonly announcementsService: AnnouncementsService,
    private readonly usersService: UsersService
  ) {}

  @Post()
  @Roles(UserType.CUSTOMER)
  @FormDataRequest()
  create(@Request() req, @Body() createAnnouncementDto: CreateAnnouncementDto) {
    const { userId } = req.user;

    return this.announcementsService.create(userId, createAnnouncementDto);
  }

  @Get()
  findAll(@Query("status") status?: AnnouncementStatus) {
    if (status) {
      return this.announcementsService.findByStatus(status);
    }
    return this.announcementsService.findAll();
  }

  @Get("customer")
  @Roles(UserType.CUSTOMER)
  async findFuturesAnnouncementsByCustomer(@Request() req) {
    const { userId } = req.user;

    const user = await this.usersService.findOneById(userId);

    return this.announcementsService.findFuturesByCustomer(user.customer_id);
  }

  @Get("customer/past")
  @Roles(UserType.CUSTOMER)
  async findPastAnnouncementsByCustomer(@Request() req) {
    const { userId } = req.user;

    const user = await this.usersService.findOneById(userId);

    return this.announcementsService.findPastByCustomer(user.customer_id);
  }

  @Get(":id")
  findOne(@Param("id") id: string) {
    return this.announcementsService.findOne(+id);
  }

  @Patch(":id")
  update(
    @Param("id") id: string,
    @Body() updateAnnouncementDto: UpdateAnnouncementDto
  ) {
    return this.announcementsService.update(+id, updateAnnouncementDto);
  }

  @Patch(":id/status")
  updateStatus(
    @Param("id") id: string,
    @Body("status") status: AnnouncementStatus
  ) {
    return this.announcementsService.updateStatus(+id, status);
  }

  @Delete(":id")
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param("id") id: string) {
    return this.announcementsService.remove(+id);
  }
}
