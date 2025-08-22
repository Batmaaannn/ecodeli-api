import { forwardRef, Module } from "@nestjs/common";
import { AnnouncementsService } from "./announcements.service";
import { AnnouncementsController } from "./announcements.controller";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Announcement } from "./entities/annoucement.entity";
import { FileSystemStoredFile, NestjsFormDataModule } from "nestjs-form-data";
import { DeliveriesModule } from "../deliveries/deliveries.module";

@Module({
  imports: [
    TypeOrmModule.forFeature([Announcement]),
    NestjsFormDataModule.config({ storage: FileSystemStoredFile }),
    forwardRef(() => DeliveriesModule),
  ],
  providers: [AnnouncementsService],
  controllers: [AnnouncementsController],
})
export class AnnouncementsModule {}
