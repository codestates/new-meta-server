import { ObjectType, Field } from "type-graphql";

import { User } from "../../../entities/User";
import { Post } from "../../../entities/Post";
import { Like } from "../../../entities/Like";

@ObjectType()
export class MyinfoResponseType {
	@Field(() => User)
	user?: User;

	@Field(() => [Post], { nullable: true })
	posts?: Post;

	@Field(() => [Like], { nullable: true })
	likes?: Like;
}
