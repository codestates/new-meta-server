import { Field, ObjectType } from "type-graphql";
import { User } from "../../../entities/User";

@ObjectType()
export class CreateFollowResponseType {
	@Field(() => User)
	subject: User;

	@Field(() => User)
	target: User;
}
