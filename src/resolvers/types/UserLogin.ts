import { User } from "../../entities/User";
import { ObjectType, Field, InputType } from "type-graphql";
import { IsEmail } from "class-validator";

@InputType()
export class LoginInput implements Partial<User> {
	@Field()
	@IsEmail()
	email: string;

	@Field()
	password: string;
}

@ObjectType()
export class LoginResponse {
	@Field()
	token: string;

	@Field(() => User, { nullable: true })
	user?: User;
}
