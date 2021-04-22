import { Field, ID, ObjectType } from "type-graphql";
import {
	BaseEntity,
	Column,
	Entity,
	OneToMany,
	OneToOne,
	PrimaryGeneratedColumn,
} from "typeorm";

import { Post } from "./Post";
import { Like } from "./Like";
import { Follow } from "./Follow";
import { OpenAuth } from "./OpenAuth";

@ObjectType()
@Entity()
export class User extends BaseEntity {
	@Field(() => ID)
	@PrimaryGeneratedColumn("uuid")
	id: string;

	// local authentication
	@Field()
	@Column()
	nickname!: string;

	@Field({ nullable: true })
	@Column({ nullable: true, unique: true })
	email?: string;

	@Column({ nullable: true })
	password?: string;

	// open authentication
	@OneToOne(() => OpenAuth, (openAuth) => openAuth.user)
	openAuth?: OpenAuth;

	// relations among entities
	@Field(() => [Post], { nullable: true })
	@OneToMany(() => Post, (post) => post.user, { nullable: true })
	posts: Post[];

	@Field(() => [Like], { nullable: true })
	@OneToMany(() => Like, (like) => like.user)
	likes: Like[];

	@Field(() => [Follow], { nullable: true })
	@OneToMany(() => Follow, (follow) => follow.subject, { nullable: true })
	subject: Follow[];

	@Field(() => [Follow], { nullable: true })
	@OneToMany(() => Follow, (follow) => follow.target, { nullable: true })
	target: Follow[];
}
