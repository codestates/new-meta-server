import { ObjectType, Field } from "type-graphql";

import { User } from "../../../entities/User";
import { Post } from "../../../entities/Post";
import { Like } from "../../../entities/Like";
import { Follow } from "../../../entities/Follow";

@ObjectType()
export class MyinfoResponseType {
	@Field(() => User)
	user?: User;

	@Field(() => [Post], { nullable: true })
	posts?: Post;

	@Field(() => [Like], { nullable: true })
	likes?: Like;

	@Field(() => [Follow], { nullable: true })
	followings?: Follow;

	@Field(() => [Follow], { nullable: true })
	followers?: Follow;
}
