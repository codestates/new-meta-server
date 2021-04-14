import { Field, ObjectType } from "type-graphql";
import {
	BaseEntity,
	Column,
	CreateDateColumn,
	Entity,
	ManyToOne,
	OneToMany,
	PrimaryGeneratedColumn,
} from "typeorm";

import { User } from "./User";
import { Like } from "./Like";

@ObjectType()
@Entity({ name: "posts" })
export class Post extends BaseEntity {
	@Field()
	@PrimaryGeneratedColumn("uuid")
	id: string;

	@Field()
	@Column()
	post_title: string;

	@Field()
	@Column()
	post_content: string;

	@Field()
	@CreateDateColumn()
	created_at: Date;

	@Field(() => [Like], { nullable: true })
	@OneToMany(() => Like, (like) => like.post)
	likes: Like[];

	@ManyToOne(() => User, (user) => user.posts, { nullable: true })
	user: User;
}
