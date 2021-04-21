import { Field, InputType, ObjectType } from "type-graphql";
import { Post } from "../../../entities/Post";
import { User } from "../../../entities/User";

@InputType()
export class UpdatePostInputType implements Partial<Post> {
	@Field()
	id!: string;

	@Field({ nullable: true })
	champion?: string;

	@Field({ nullable: true })
	title?: string;

	@Field({ nullable: true })
	description?: string;

	@Field({ nullable: true })
	skills?: string;

	@Field({ nullable: true })
	play?: string;

	@Field({ nullable: true })
	etc?: string;
}

@ObjectType()
export class UpdatePostResponseType {
	@Field()
	champion: string;

	@Field()
	title: string;

	@Field()
	description: string;

	@Field()
	skills: string;

	@Field()
	play: string;

	@Field()
	etc: string;

	@Field()
	updatedAt: Date;

	@Field()
	createdAt: Date;

	@Field(() => User)
	user: User;
}
