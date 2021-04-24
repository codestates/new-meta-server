import { Field, ID, ObjectType } from "type-graphql";
import {
	BaseEntity,
	Column,
	Entity,
	OneToMany,
	PrimaryGeneratedColumn,
} from "typeorm";

import { Post } from "./Post";
import { Like } from "./Like";
import { Follow } from "./Follow";

@ObjectType()
@Entity()
export class User extends BaseEntity {
	@Field(() => ID)
	@PrimaryGeneratedColumn("uuid")
	id: string;

	// local authentication
	@Field()
	@Column()
	nickname: string;

	@Field()
	@Column({ unique: true })
	email: string;

	@Column()
	password: string;

	@Column({ default: "local" })
	accountType: string;

	// relations among entities
	@Field(() => [Post], { nullable: true })
	@OneToMany(() => Post, (post) => post.user, { nullable: true, cascade: true })
	posts?: Post[];

	@Field(() => [Like], { nullable: true })
	@OneToMany(() => Like, (like) => like.user, { cascade: true })
	likes?: Like[];

	@Field(() => [Follow], { nullable: true })
	@OneToMany(() => Follow, (follow) => follow.subject, {
		nullable: true,
		cascade: true,
	})
	subject?: Follow[];

	@Field(() => [Follow], { nullable: true })
	@OneToMany(() => Follow, (follow) => follow.target, {
		nullable: true,
		cascade: true,
	})
	target?: Follow[];
}
