import { Field, ObjectType } from "type-graphql";
import {
	BaseEntity,
	Column,
	CreateDateColumn,
	Entity,
	ManyToOne,
	PrimaryGeneratedColumn,
} from "typeorm";

import { User } from "./User";
import { Post } from "./Post";

@ObjectType()
@Entity()
export class Like extends BaseEntity {
	@Field()
	@PrimaryGeneratedColumn("uuid")
	id: string;

	@Field()
	@Column()
	postTitle: string;

	@Field()
	@CreateDateColumn()
	createdAt: Date;

	@Field(() => User)
	@ManyToOne(() => User, (user) => user.likes, { nullable: true })
	user: User;

	@Field(() => Post)
	@ManyToOne(() => Post, (post) => post.likes, { nullable: true })
	post: Post;
}
