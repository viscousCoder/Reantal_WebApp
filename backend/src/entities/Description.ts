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
export class Description {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column({ type: "text" })
  title!: string;

  @Column({ type: "text" })
  description!: string;

  @Column({ type: "text" })
  shortDescription!: string;

  @Column("simple-array")
  amenities!: string[];

  @Column()
  neighborhood!: string;

  @Column({ type: "text" })
  transportation!: string;

  @Column({ type: "text" })
  neighborhoodDescription!: string;

  @Column("simple-array")
  pointsOfInterest!: string[];

  @Column("float")
  neighborhoodLatitude!: number;

  @Column("float")
  neighborhoodLongitude!: number;

  @OneToOne(() => Property, (property) => property.description, {
    onDelete: "CASCADE",
  })
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
