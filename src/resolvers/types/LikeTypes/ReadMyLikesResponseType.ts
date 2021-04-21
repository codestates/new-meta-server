import { Field, ObjectType } from "type-graphql";
import { JoinColumn } from "typeorm";
import { Like } from "../../../entities/Like";
import { Post } from "../../../entities/Post";
import { User } from "../../../entities/User";

@ObjectType()
export class ReadMyLikesResponseType {
	@Field(() => [Post])
	posts: Post;

	@Field(() => User)
	user: User;

	@Field(() => [Like])
	likes: Like[];
}
