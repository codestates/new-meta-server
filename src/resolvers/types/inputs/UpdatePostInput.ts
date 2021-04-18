import { Post } from "../../../entities/Post";
import { Field, InputType } from "type-graphql";

@InputType()
export class UpdatePostInput implements Partial<Post> {
	@Field()
	readonly id: string;

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
