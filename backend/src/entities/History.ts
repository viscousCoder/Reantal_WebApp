import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
} from "typeorm";
import { User } from "./Users";

@Entity("history")
export class History {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column({ nullable: true })
  userId?: string;

  @Column("text", { nullable: true })
  url?: string;

  @ManyToOne(() => User, (user) => user.history, {
    onDelete: "CASCADE",
    nullable: true,
  })
  @JoinColumn({ name: "userId" })
  user?: User;

  @CreateDateColumn({ type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
  created_at!: Date;
}
