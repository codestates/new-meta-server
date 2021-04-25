import { MinLength } from "class-validator";
import { Field, InputType } from "type-graphql";

@InputType()
export class UpdatePasswordType {
	@Field()
	@MinLength(8)
	currentPassword: string;

	@Field()
	@MinLength(8)
	newPassword: string;
}
