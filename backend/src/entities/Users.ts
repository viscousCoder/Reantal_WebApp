import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from "typeorm";
import { Booking } from "./Booking";
import { Property } from "./Property"; // Import the Property entity
import { History } from "./History";
import { PaymentMethod } from "./PaymentMethod";

@Entity("users")
export class User {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column()
  fullName!: string;

  @Column({ unique: true })
  email!: string;

  @Column()
  phoneCode!: string;

  @Column({ unique: true })
  phoneNumber!: string;

  @Column()
  password!: string;

  @Column({ default: false })
  agreeToTerms!: boolean;

  @Column()
  street!: string;

  @Column()
  city!: string;

  @Column()
  state!: string;

  @Column()
  zip!: string;

  @Column()
  country!: string;

  @Column({ default: false })
  emailVerified!: boolean;

  @Column({ default: false })
  phoneVerified!: boolean;

  @Column({ default: false })
  block!: boolean;

  @Column({ default: "tenant" })
  userRole!: string;

  @Column({ type: "text", nullable: true })
  employment!: string;

  @Column({ type: "text", nullable: true })
  income!: string;

  @Column({ type: "text", nullable: true })
  rentalHistory!: string;

  @Column()
  profilePicture!: string;

  @Column({ nullable: true })
  paymentMethod!: string;

  @OneToMany(() => Booking, (booking) => booking.user, {
    // eager: true, // Automatically load bookings when the user is queried
    cascade: true, // Automatically delete bookings when the user is deleted
    onDelete: "CASCADE", // Delete all bookings associated with the user when the user is deleted
  })
  bookings!: Booking[];

  @OneToMany(() => History, (history) => history.user, {
    cascade: true,
    onDelete: "CASCADE",
  })
  history?: History[];

  @OneToMany(() => PaymentMethod, (pm) => pm.user, { cascade: true })
  paymentMethods!: PaymentMethod[];

  // Add the one-to-many relationship with Property
  // @OneToMany(() => Property, (property) => property.user, {
  //   // eager: true,
  //   cascade: true,
  //   onDelete: "CASCADE",
  // })
  // properties!: Property[];

  @CreateDateColumn({ type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
  created_at!: Date;

  @UpdateDateColumn({
    type: "timestamp",
    default: () => "CURRENT_TIMESTAMP",
    onUpdate: "CURRENT_TIMESTAMP",
  })
  updated_at!: Date;
}
