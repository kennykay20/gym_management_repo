import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { GymService } from './gym.service';
import { Cron, CronExpression } from '@nestjs/schedule';
import { AddOnServiceCreateDto } from './dtos/addonService.dto';
import { AddMemberCreateDto } from '../user/dtos/add.member.dto';

@Controller('v1/gym')
export class GymController {
  constructor(private gymSvc: GymService) {}

  @Cron(CronExpression.EVERY_10_SECONDS)
  HandleGymCron() {
    console.log('called every 10 seconds');
  }

  @Post('addonService')
  @UsePipes(new ValidationPipe())
  SubscribeAddOnSvc(@Body() createAddOnDto: AddOnServiceCreateDto) {
    return this.gymSvc.createAddOnService(createAddOnDto);
  }

  @Post('addMembership')
  @UsePipes(new ValidationPipe())
  CreateGymMember(@Body() createGymMemberGto: AddMemberCreateDto) {
    return this.gymSvc.addMember(createGymMemberGto);
  }

  @Get()
  GetAddOnServices() {
    return this.gymSvc.getAllAddOnService();
  }

  @Get(':id')
  GetAddOnService(@Param('id') id: string) {
    return this.gymSvc.getAddOnServiceById(id);
  }

  @Cron(CronExpression.EVERY_DAY_AT_10AM)
  RemindAnnualMemberDueDate() {
    return this.gymSvc.calculateAnnualDueDate();
  }

  @Cron(CronExpression.EVERY_DAY_AT_11AM)
  RemindMonthlyMemberDueDate() {
    return this.gymSvc.calculateMonthlyDueDate();
  }
}
