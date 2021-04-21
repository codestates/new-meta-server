import { User } from "../../../entities/User";
import { Post } from "../../../entities/Post";
import { ObjectType, Field } from "type-graphql";

@ObjectType()
export class MyinfoResponseType {
	@Field(() => User)
	user?: User;

	@Field(() => [Post], { nullable: true })
	posts?: Post;
}
