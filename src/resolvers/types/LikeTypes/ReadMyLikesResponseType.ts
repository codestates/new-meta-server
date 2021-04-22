import { Field, ObjectType } from "type-graphql";

import { Like } from "../../../entities/Like";
import { Post } from "../../../entities/Post";
import { User } from "../../../entities/User";

@ObjectType()
export class ReadMyLikesResponseType {
	@Field(() => User)
	user: User;

	@Field(() => [Like])
	likes: Like[];
}
