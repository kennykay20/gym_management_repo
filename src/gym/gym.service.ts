import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { AddOnServiceCreateDto } from './dtos/addonService.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { addOnServicesTable } from './models/addOnService.model';
import { Repository } from 'typeorm';
import { UserService } from 'src/user/user.service';
import { AddMemberCreateDto } from 'src/user/dtos/add.member.dto';
import { UserMember } from '../user/models/members.model';
import { v4 as uuidv4 } from 'uuid';
import { MailService } from 'src/mail/mail.service';

@Injectable()
export class GymService {
  constructor(
    @InjectRepository(addOnServicesTable)
    private readonly addOnSvcRepo: Repository<addOnServicesTable>,
    private readonly userSvc: UserService,
    @InjectRepository(UserMember)
    private readonly memberRepo: Repository<UserMember>,
    private readonly mailSvc: MailService,
  ) {}

  async addMember(addMemberDto: AddMemberCreateDto) {
    const { firstName, lastName, email, MembershipType, totalAmount } =
      addMemberDto;
    try {
      const checkUser = await this.userSvc.getUserByEmail(email);
      if (!checkUser) {
        throw new HttpException('Email not found! ', HttpStatus.NOT_FOUND);
      }
      // check if email already a member
      const emailExist = await this.userSvc.checkEmailMember(email);
      if (emailExist) {
        throw new HttpException(
          'Email already added as a member! ',
          HttpStatus.BAD_REQUEST,
        );
      }
      const userMember = new UserMember();
      userMember.membership_ID = uuidv4();
      userMember.email = email;
      userMember.first_name = firstName;
      userMember.last_name = lastName;
      userMember.membership_type = MembershipType;
      const newDate = new Date();
      const currentYear = newDate.getFullYear();
      const currentMonth = newDate.getMonth();
      const oldDate = new Date(checkUser.createdAt);
      const oldYear = oldDate.getFullYear();
      const oldMonth = oldDate.getMonth();
      if (oldYear === currentYear) {
        if (oldMonth === currentMonth) {
          userMember.isFirstMonth = true;
        } else {
          userMember.isFirstMonth = false;
        }
      } else {
        userMember.isFirstMonth = false;
      }
      userMember.startDate = new Date();
      if (MembershipType.toUpperCase() === 'ANNUAL') {
        console.log('inside the annual');
        const aYearFromNow = new Date();
        aYearFromNow.setFullYear(aYearFromNow.getFullYear() + 1);
        userMember.dueDate = aYearFromNow;
      } else {
        console.log('inside the monthly');
        const aMonthFromNow = new Date();
        aMonthFromNow.setMonth(aMonthFromNow.getMonth() + 1);
        userMember.dueDate = aMonthFromNow;
      }
      userMember.totalAmount = totalAmount;
      const addMember = this.memberRepo.save(userMember);
      // send email to member
      return addMember;
    } catch (error) {
      Logger.log(error);
    }
  }

  async getMembers() {
    const result = await this.memberRepo.find();
    return result;
  }

  async createAddOnService(addOnCreate: AddOnServiceCreateDto) {
    const { membershipId, serviceName, monthlyAmount } = addOnCreate;
    const member = await this.userSvc.getMemberById(membershipId);
    if (!member) {
      throw new HttpException('Member not found! ', HttpStatus.NOT_FOUND);
    }
    try {
      const addOnSvcTbl = new addOnServicesTable();
      addOnSvcTbl.membership = member;
      addOnSvcTbl.serviceName = serviceName;
      addOnSvcTbl.monthlyAmount = monthlyAmount;

      const saveAddOn = await this.addOnSvcRepo.save(addOnSvcTbl);
      await this.userSvc.updateMemberAmount(saveAddOn.ID, monthlyAmount);
      return saveAddOn;
    } catch (error) {
      Logger.log(error);
    }
  }

  async getAllAddOnService(): Promise<addOnServicesTable[] | null> {
    return await this.addOnSvcRepo.find();
  }

  async getAddOnServiceById(id: string): Promise<addOnServicesTable | null> {
    try {
      const result = await this.addOnSvcRepo.findOne({
        where: { ID: id },
      });

      if (!result) {
        throw new HttpException(
          `AddOnService not found with id ${id}`,
          HttpStatus.NOT_FOUND,
        );
      }
      return result;
    } catch (error) {
      Logger.log(error);
    }
  }

  async calculateAnnualDueDate() {
    try {
      const allMember = await this.getMembers();
      if (allMember) {
        allMember.map((data) => {
          if (
            data.isFirstMonth &&
            data.membership_type.toUpperCase() === 'ANNUAL'
          ) {
            const currentDate = new Date();
            const formatDate = new Date(data.dueDate);
            const value = formatDate.getDate() - currentDate.getDate();
            if (value === 7) {
              // send email to user
            }
          }
        });
      }
    } catch (error) {
      Logger.log(error);
    }
  }

  async calculateMonthlyDueDate() {
    try {
      const allMember = await this.getAllAddOnService();
      if (allMember) {
        allMember.map((data) => {
          const currentDate = new Date();
          const formatDate = new Date(data.dueDate);
          const value = formatDate.getDate() - currentDate.getDate();
          if (value === 7) {
            // send email to user
          }
        });
      }
    } catch (error) {
      Logger.log(error);
    }
  }
}
