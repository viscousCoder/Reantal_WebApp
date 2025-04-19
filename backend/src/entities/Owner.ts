import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from "typeorm";
import { Booking } from "./Booking";
import { Property } from "./Property";

@Entity()
export class Owner {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column()
  fullName!: string;

  @Column({ unique: true })
  email!: string;

  @Column()
  phoneCode!: string;

  @Column()
  phoneNumber!: string;

  @Column({ nullable: true })
  companyName?: string;

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

  @Column()
  password!: string;

  @Column()
  agreeToTerms!: boolean;

  @Column({ default: false })
  block!: boolean;

  @Column()
  profilePicture!: string;

  @Column()
  verificationMethod!: "email" | "phone";

  @Column({ nullable: true })
  emailOtp?: string;

  @Column({ default: "owner" })
  userRole!: string;

  @Column({ nullable: true })
  phoneOtp?: string;

  @Column({ default: false })
  emailVerified!: boolean;

  @Column({ default: false })
  phoneVerified!: boolean;

  @Column({ nullable: true })
  generatedEmailOtp?: string;

  @Column({ nullable: true })
  generatedPhoneOtp?: string;

  @Column({ nullable: true })
  verifiedEmailOtp?: string;

  @Column({ nullable: true })
  verifiedPhoneOtp?: string;

  // @OneToMany(() => Booking, (booking) => booking.user, {
  //   // eager: true, // Automatically load bookings when the user is queried
  //   cascade: true, // Automatically delete bookings when the user is deleted
  //   onDelete: "CASCADE", // Delete all bookings associated with the user when the user is deleted
  // })
  // bookings!: Booking[];

  // Add the one-to-many relationship with Property
  @OneToMany(() => Property, (property) => property.owner, {
    // eager: true,
    cascade: true,
    onDelete: "CASCADE",
  })
  properties!: Property[];

  @CreateDateColumn({ type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
  created_at!: Date;

  @UpdateDateColumn({
    type: "timestamp",
    default: () => "CURRENT_TIMESTAMP",
    onUpdate: "CURRENT_TIMESTAMP",
  })
  updated_at!: Date;
}
