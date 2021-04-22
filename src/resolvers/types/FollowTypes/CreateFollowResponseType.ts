import { Field, ObjectType } from "type-graphql";
import { User } from "../../../entities/User";
import { Follow } from "../../../entities/Follow";

@ObjectType()
export class CreateFollowResponseType {
	@Field(() => User)
	user: User;

	@Field()
	message: string;
}
