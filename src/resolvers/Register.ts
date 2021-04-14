import { Arg, Mutation, Resolver } from "type-graphql";
import bcrypt from "bcryptjs";

import { User } from "../entities/User";
import { RegisterInput } from "./types/inputs/RegisterInput";

@Resolver()
export class RegisterResolver {
	@Mutation(() => User)
	async register(
		@Arg("data") { nickname, email, password }: RegisterInput
	): Promise<User> {
		const hashedPassword = await bcrypt.hash(password, 8);

		const user = await User.create({
			nickname,
			email,
			password: hashedPassword,
		}).save();

		return user;
	}
}
