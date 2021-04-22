import { Field, ObjectType } from "type-graphql";
import {
	BaseEntity,
	Column,
	CreateDateColumn,
	Entity,
	ManyToOne,
	OneToMany,
	PrimaryGeneratedColumn,
	UpdateDateColumn,
} from "typeorm";

import { User } from "./User";
import { Like } from "./Like";

@ObjectType()
@Entity()
export class Post extends BaseEntity {
	@Field()
	@PrimaryGeneratedColumn("uuid")
	id: string;

	@Field()
	@Column()
	champion: string;

	@Field()
	@Column()
	title: string;

	@Field()
	@Column()
	description: string;

	@Field()
	@Column()
	skills: string;

	@Field()
	@Column()
	play: string;

	@Field()
	@Column()
	etc: string;

	@Field()
	@CreateDateColumn()
	createdAt: Date;

	@Field()
	@UpdateDateColumn()
	updatedAt: Date;

	@Field({ defaultValue: 0 })
	@Column({ default: 0 })
	numberOfLikes: number;

	@Field(() => User)
	@ManyToOne(() => User, (user) => user.posts, { nullable: true })
	user: User;

	@Field(() => [Like], { nullable: true })
	@OneToMany(() => Like, (like) => like.post)
	likes: Like[];
}
