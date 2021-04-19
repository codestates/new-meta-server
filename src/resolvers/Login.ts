import { Arg, Mutation, Query, Resolver } from "type-graphql";
import { compare } from "bcryptjs";
import dotenv from "dotenv";
dotenv.config();

import { User } from "../entities/User";
import { LoginInput, LoginResponse } from "./types/userLogin";
import { generateToken } from "../lib/jwt";

@Resolver()
export class LoginResolver {
	@Query(() => String)
	async hello() {
		return "hello world";
	}

	@Mutation(() => LoginResponse)
	async login(
		@Arg("data") { email, password }: LoginInput
	): Promise<LoginResponse> {
		const user = await User.findOne({ where: { email } });
		if (!user) throw new Error("Email not found");

		const valid = await compare(password, user.password);
		if (!valid) throw new Error("Check your password");

		return { token: generateToken(user.id), user };
	}
}
