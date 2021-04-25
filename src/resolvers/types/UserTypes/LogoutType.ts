import { ObjectType, Field } from "type-graphql";

import { User } from "../../../entities/User";

@ObjectType()
export class LogoutResponseType {
	@Field()
	token: string;

	@Field()
	message: string;

	@Field(() => User)
	user: User;
}
