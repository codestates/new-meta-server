import { IsEmail, MinLength } from "class-validator";
import { Field, InputType } from "type-graphql";

@InputType()
export class DeleteAccountInput {
	@Field()
	@IsEmail()
	email: string;

	@Field()
	@MinLength(8)
	password: string;
}
