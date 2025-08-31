import { forwardRef, Module } from "@nestjs/common";
import { AnnouncementsService } from "./announcements.service";
import { AnnouncementsController } from "./announcements.controller";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Announcement } from "./entities/announcement.entity";
import { FileSystemStoredFile, NestjsFormDataModule } from "nestjs-form-data";
import { DeliveriesModule } from "../deliveries/deliveries.module";
import { UsersModule } from "../users/users.module";
import { Customer } from "../customers/entities/customer.entity";

@Module({
  imports: [
    TypeOrmModule.forFeature([Announcement, Customer]),
    NestjsFormDataModule.config({ storage: FileSystemStoredFile }),
    forwardRef(() => DeliveriesModule),
    forwardRef(() => UsersModule),
  ],
  providers: [AnnouncementsService],
  controllers: [AnnouncementsController],
  exports: [AnnouncementsService],
})
export class AnnouncementsModule {}
