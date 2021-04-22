import { IsEmail, Length, MinLength } from "class-validator";
import { Field, InputType, ObjectType } from "type-graphql";

@InputType()
export class RegisterInputType {
	@Field()
	@Length(1, 20)
	nickname: string;

	@Field()
	@IsEmail()
	email: string;

	@Field()
	@MinLength(8)
	password: string;
}

@ObjectType()
export class RegisterResponseType {
	@Field()
	id: string;

	@Field()
	email: string;

	@Field()
	nickname: string;
}
