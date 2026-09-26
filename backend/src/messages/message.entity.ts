import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
} from 'typeorm';
import { User } from '../users/user.entity';
import { Channel } from '../channels/channel.entity';

@Entity('messages')
export class Message {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  text: string;

  @ManyToOne(() => User)
  author: User;

  @ManyToOne(() => Channel, { nullable: true })
  channel: Channel;

  @ManyToOne(() => User, { nullable: true })
  recipient: User;

  @CreateDateColumn()
  createdAt: Date;
}
