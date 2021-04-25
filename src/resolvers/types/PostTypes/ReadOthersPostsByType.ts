import { ObjectType, Field } from "type-graphql";

import { Post } from "../../../entities/Post";
import { User } from "../../../entities/User";

@ObjectType()
export class ReadOthersPostsByResponseType {
	@Field(() => [Post])
	posts: Post;

	@Field(() => User)
	user: User;
}
