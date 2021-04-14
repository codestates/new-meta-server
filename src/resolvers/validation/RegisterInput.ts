import { IsEmail, Length, MinLength } from "class-validator";
import { Field, InputType } from "type-graphql";
import { isEmailAlreadyExist } from "./isEmailAlreadyExist";
import { isNicknameAlreadyExist } from "./isNicknameAlreadyExist";

@InputType()
export class RegisterInput {
	@Field()
	@Length(1, 20)
	@isNicknameAlreadyExist({ message: "nickname already in use" })
	nickname: string;

	@Field()
	@IsEmail()
	@isEmailAlreadyExist({ message: "email already in use" })
	email: string;

	@Field()
	@MinLength(8)
	password: string;
}
