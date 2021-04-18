import { ObjectType, Field } from "type-graphql";
import { User } from "../../../entities/User";

@ObjectType()
export class LoginResponse {
	@Field()
	accessToken: string;

	@Field(() => User, { nullable: true })
	user?: User;
}
