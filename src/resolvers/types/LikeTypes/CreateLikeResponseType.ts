import { Field, ObjectType } from "type-graphql";
import { Post } from "../../../entities/Post";
import { User } from "../../../entities/User";
import { Like } from "../../../entities/Like";

@ObjectType()
export class CreateLikeResponseType {
	@Field(() => Post)
	post: Post;

	@Field(() => User)
	user: User;

	@Field(() => [Like])
	like: Like;
}
