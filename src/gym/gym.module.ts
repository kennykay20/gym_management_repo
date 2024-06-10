import { Module } from '@nestjs/common';
import { GymController } from './gym.controller';
import { GymService } from './gym.service';
import { UserModule } from '../user/user.module';
import { MailModule } from '../mail/mail.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { addOnServicesTable } from './models/addOnService.model';
import { UserMember } from '../user/models/members.model';

@Module({
  imports: [
    UserModule,
    MailModule,
    TypeOrmModule.forFeature([addOnServicesTable, UserMember]),
  ],
  controllers: [GymController],
  providers: [GymService],
})
export class GymModule {}
