import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";
import { User } from "./Users";

@Entity("payment_methods")
export class PaymentMethod {
  @PrimaryGeneratedColumn("uuid") id!: string;

  @Column() type!: "Card" | "UPI";

  @Column({ nullable: true }) cardNumber!: string; // **** **** **** 1234
  @Column({ nullable: true }) cardHolder!: string;
  @Column({ nullable: true }) bankName!: string;
  @Column({ nullable: true }) ifsc!: string;

  @Column({ nullable: true }) upiId!: string;

  @ManyToOne(() => User, (user) => user.paymentMethods, { onDelete: "CASCADE" })
  user!: User;

  @CreateDateColumn({ type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
  created_at!: Date;

  @UpdateDateColumn({
    type: "timestamp",
    default: () => "CURRENT_TIMESTAMP",
    onUpdate: "CURRENT_TIMESTAMP",
  })
  updated_at!: Date;
}
