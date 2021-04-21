import { Field, InputType, ObjectType } from "type-graphql";
import { Post } from "../../../entities/Post";
import { User } from "../../../entities/User";

@ObjectType()
export class FetchAllPostsResponseType {
	@Field(() => [Post])
	posts: Post;

	@Field(() => User)
	user: User;
}
