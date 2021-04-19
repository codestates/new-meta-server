import { ObjectType, Field } from "type-graphql";
import { User } from "../../../entities/User";

@ObjectType()
export class MeResponse {
	@Field()
	token: string;

	@Field(() => User, { nullable: true })
	user?: User;
}
