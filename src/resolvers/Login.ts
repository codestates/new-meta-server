import { Arg, Ctx, Mutation, Resolver } from "type-graphql";
import bcrypt from "bcryptjs";
import { User } from "../entities/User";
import { MyContext } from "./types/MyContext";

@Resolver()
export class LoginResolver {
	@Mutation(() => User, { nullable: true })
	async login(
		@Arg("email") email: string,
		@Arg("password") password: string,
		@Ctx() ctx: MyContext
	): Promise<User | string> {
		const user = await User.findOne({ email });

		if (!user) {
			return "check your email or password";
		}

		const valid = await bcrypt.compare(password, user.password);

		if (!valid) {
			return "check your email or password";
		}

		ctx.req.session!.userId = user.id;

		return user;
	}
}
