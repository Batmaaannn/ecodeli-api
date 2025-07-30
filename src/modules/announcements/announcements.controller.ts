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
  HttpCode 
} from '@nestjs/common';
import { AnnouncementsService, CreateAnnouncementDto, UpdateAnnouncementDto } from './announcements.service';
import { AnnouncementStatus } from 'src/types/announcement';

@Controller('announcements')
export class AnnouncementsController {
  constructor(private readonly announcementsService: AnnouncementsService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(@Body() createAnnouncementDto: CreateAnnouncementDto) {
    return this.announcementsService.create(createAnnouncementDto);
  }

  @Get()
  findAll(@Query('status') status?: AnnouncementStatus) {
    if (status) {
      return this.announcementsService.findByStatus(status);
    }
    return this.announcementsService.findAll();
  }

  @Get('customer/:customerId')
  findByCustomer(@Param('customerId') customerId: string) {
    return this.announcementsService.findByCustomer(+customerId);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.announcementsService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateAnnouncementDto: UpdateAnnouncementDto) {
    return this.announcementsService.update(+id, updateAnnouncementDto);
  }

  @Patch(':id/status')
  updateStatus(@Param('id') id: string, @Body('status') status: AnnouncementStatus) {
    return this.announcementsService.updateStatus(+id, status);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id') id: string) {
    return this.announcementsService.remove(+id);
  }
}
