import { MembershipType } from 'src/utils';
import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  PrimaryColumn,
} from 'typeorm';

@Entity({ name: 'user_members' })
export class UserMember extends BaseEntity {
  @PrimaryColumn()
  membership_id: string;

  @Column({ length: 500 })
  first_name: string;

  @Column({ length: 500 })
  last_name: string;

  @Column()
  membership_type: MembershipType;

  @Column()
  totalAmount: number;

  @Column({ unique: true, nullable: false })
  email: string;

  @Column({ default: false })
  isFirstMonth: boolean;

  @CreateDateColumn({ type: 'timestamp with time zone' })
  startDate: Date;

  @CreateDateColumn({ type: 'timestamp with time zone' })
  dueDate: Date;
}
