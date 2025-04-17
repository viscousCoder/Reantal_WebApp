import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToOne,
  CreateDateColumn,
  UpdateDateColumn,
} from "typeorm";
import { Property } from "./Property";

@Entity()
export class PropertyPolicies {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column()
  petPolicy!: "allowed" | "restricted" | "none";

  @Column()
  smokingPolicy!: "allowed" | "outside" | "none";

  @Column({ type: "text" })
  petPolicyDescription!: string;

  @Column({ type: "text" })
  smokingPolicyDescription!: string;

  @Column({ type: "text" })
  noisePolicy!: string;

  @Column({ type: "text" })
  guestPolicy!: string;

  @Column({ type: "json", nullable: true })
  additionalPolicies!: { id: number; title: string; description: string }[];

  @OneToOne(() => Property, (property) => property.policies)
  property!: Property;

  @CreateDateColumn({ type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
  created_at!: Date;

  @UpdateDateColumn({
    type: "timestamp",
    default: () => "CURRENT_TIMESTAMP",
    onUpdate: "CURRENT_TIMESTAMP",
  })
  updated_at!: Date;
}

// import {
//   Entity,
//   Column,
//   PrimaryGeneratedColumn,
//   OneToOne,
//   JoinColumn,
//   CreateDateColumn,
//   UpdateDateColumn,
// } from "typeorm";
// import { Property } from "./Property";

// @Entity()
// export class PropertyPolicies {
//   @PrimaryGeneratedColumn("uuid")
//   id!: string;

//   @Column()
//   petPolicy!: "allowed" | "restricted" | "none";

//   @Column()
//   smokingPolicy!: "allowed" | "outside" | "none";

//   @Column({ type: "text" })
//   petPolicyDescription!: string;

//   @Column({ type: "text" })
//   smokingPolicyDescription!: string;

//   @Column({ type: "text" })
//   noisePolicy!: string;

//   @Column({ type: "text" })
//   guestPolicy!: string;

//   @Column({ type: "json", nullable: true })
//   additionalPolicies!: { id: number; title: string; description: string }[];

//   @OneToOne(() => Property, (property) => property.policies)
//   @JoinColumn()
//   property!: Property;

//   @CreateDateColumn({ type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
//   created_at!: Date;

//   @UpdateDateColumn({
//     type: "timestamp",
//     default: () => "CURRENT_TIMESTAMP",
//     onUpdate: "CURRENT_TIMESTAMP",
//   })
//   updated_at!: Date;
// }
