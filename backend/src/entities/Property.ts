import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";
import { PropertyPhoto } from "./PropertyPhoto";
import { Description } from "./Description";
import { PropertyPolicies } from "./PropertyPolicies";
// import { User } from "./Users";
import { Booking } from "./Booking";
import { Owner } from "./Owner";

@Entity()
export class Property {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column()
  address!: string;

  @Column()
  propertyType!: string;

  @Column()
  squareFootage!: number;

  @Column()
  bedrooms!: number;

  @Column()
  bathrooms!: number;

  @Column()
  rent!: number;

  @Column()
  noOfSet!: number;

  @Column()
  totalRoom!: number;

  @Column()
  securityDeposit!: number;

  @Column()
  leaseTerm!: string;

  @Column({ type: "timestamp", nullable: true })
  availableDate!: Date | null;

  @Column({ default: true })
  isAvailable!: boolean;

  @ManyToOne(() => Owner, (owner) => owner.properties, {
    onDelete: "CASCADE",
    nullable: false,
  })
  @JoinColumn({ name: "ownerId" })
  owner!: Owner;

  // Relationships
  @OneToMany(() => PropertyPhoto, (photo) => photo.property, {
    cascade: true,
    eager: true,
    onDelete: "CASCADE",
  })
  photos!: PropertyPhoto[];

  @OneToOne(() => Description, (desc) => desc.property, {
    cascade: true,
    eager: true,
    onDelete: "CASCADE",
  })
  @JoinColumn()
  description!: Description;

  @OneToOne(() => PropertyPolicies, (policies) => policies.property, {
    cascade: true,
    eager: true,
    onDelete: "CASCADE",
  })
  @JoinColumn()
  policies!: PropertyPolicies;

  @OneToMany(() => Booking, (booking) => booking.property, {
    // eager: true,
    cascade: true,
    onDelete: "CASCADE",
  })
  bookings!: Booking[];

  @CreateDateColumn({ type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
  created_at!: Date;

  @UpdateDateColumn({
    type: "timestamp",
    default: () => "CURRENT_TIMESTAMP",
    onUpdate: "CURRENT_TIMESTAMP",
  })
  updated_at!: Date;
}
