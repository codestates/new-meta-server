import { User } from "../../../entities/User";
import { ObjectType, Field } from "type-graphql";

@ObjectType()
export class LogoutResponseType {
	@Field()
	token: string;

	@Field()
	message: string;

	@Field(() => User)
	user: User;
}
