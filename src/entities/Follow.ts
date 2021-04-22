import { Field, ObjectType } from "type-graphql";
import {
	BaseEntity,
	Column,
	CreateDateColumn,
	Entity,
	JoinColumn,
	ManyToOne,
	PrimaryGeneratedColumn,
	RelationId,
} from "typeorm";

import { User } from "./User";

@ObjectType()
@Entity()
export class Follow extends BaseEntity {
	@Field()
	@PrimaryGeneratedColumn("uuid")
	id: string;

	@Field()
	@CreateDateColumn()
	createdAt: Date;

	@Field(() => User)
	@ManyToOne(() => User, (user) => user.subject, {
		nullable: true,
		onDelete: "CASCADE",
	})
	subject: User;

	@Field(() => User)
	@ManyToOne(() => User, (user) => user.target, {
		nullable: true,
		onDelete: "CASCADE",
	})
	target: User;
}
