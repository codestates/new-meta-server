import { Field, InputType } from "type-graphql";

@InputType()
export default class AfterChangePassword {
	@Field({ nullable: true })
	email?: string;

	@Field({ nullable: true })
	password?: string;
}
