import { Field, InputType } from "type-graphql";

@InputType()
export class CreatePostInput {
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
