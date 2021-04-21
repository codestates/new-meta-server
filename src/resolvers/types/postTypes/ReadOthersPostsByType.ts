import { Post } from "../../../entities/Post";
import { User } from "../../../entities/User";
import { ObjectType, Field } from "type-graphql";

@ObjectType()
export class ReadOthersPostsByResponseType {
	@Field(() => [Post])
	posts: Post;

	@Field(() => User)
	user: User;
}
