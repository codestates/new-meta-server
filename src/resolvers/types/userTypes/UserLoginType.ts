import { User } from "../../../entities/User";
import { ObjectType, Field, InputType } from "type-graphql";
import { IsEmail } from "class-validator";

@InputType()
export class LoginInputType implements Partial<User> {
	@Field()
	@IsEmail()
	email: string;

	@Field()
	password: string;
}

@ObjectType()
export class LoginResponseType {
	@Field()
	token: string;

	@Field(() => User, { nullable: true })
	user?: User;
}
