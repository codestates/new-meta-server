import { Post } from "../../../entities/Post";
import { User } from "../../../entities/User";
import { ObjectType, Field, InputType } from "type-graphql";

@InputType()
export class CreatePostInputType {
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
}

@ObjectType()
export class CreatePostResponseType {
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

	@Field(() => User)
	user: User;
}
