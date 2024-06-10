import { ServiceName } from 'src/utils';
import { UserMember } from '../../user/models/members.model';
import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity({ name: 'addOnServices ' })
export class addOnServicesTable extends BaseEntity {
  @PrimaryGeneratedColumn()
  ID: string;

  @OneToOne(() => UserMember)
  @JoinColumn()
  membership: UserMember;

  @Column()
  serviceName: ServiceName;

  @Column()
  monthlyAmount: number;

  @CreateDateColumn({ type: 'date' })
  dueDate: Date;

  @CreateDateColumn({ type: 'timestamp with time zone' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp with time zone' })
  updatedAt: Date;
}
