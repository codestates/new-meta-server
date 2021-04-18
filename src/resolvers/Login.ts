import { Arg, Mutation, Query, Resolver } from "type-graphql";
import bcrypt from "bcryptjs";
import { User } from "../entities/User";
import { sign } from "jsonwebtoken";
import { LoginResponse } from "./types/responses/LoginResponse";
import dotenv from "dotenv";
dotenv.config();

@Resolver()
export class LoginResolver {
	@Query(() => String)
	async hello() {
		return "hello world";
	}

	@Mutation(() => LoginResponse, { nullable: true })
	async login(@Arg("email") email: string, @Arg("password") password: string) {
		const user = await User.findOne({ email });
		if (!user) throw new Error("User not found");

		const valid = await bcrypt.compare(password, user.password);
		if (!valid) throw new Error("Check your password");

		return {
			accessToken: sign(
				{ userId: user.id },
				process.env.TOKEN_SECRET as string,
				{
					expiresIn: "30d",
				}
			),
		};
	}
}
