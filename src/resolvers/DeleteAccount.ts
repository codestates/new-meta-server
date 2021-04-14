import bcrypt from "bcryptjs";
import { User } from "../entities/User";
import { Arg, Ctx, Mutation, Resolver } from "type-graphql";
import { MyContext } from "./types/MyContext";

@Resolver()
export class DeleteAccountResolver {
	@Mutation(() => Boolean, { nullable: true })
	async deleteAccount(
		@Arg("password") password: string,
		@Ctx() ctx: MyContext
	) {
		const userId = ctx.req.session!.userId;
		if (!userId) return null;

		const user = await User.findOne({ id: userId });
		if (!user) return null;

		const valid = await bcrypt.compare(password, user.password);
		if (!valid) return null;

		await user.remove();

		return new Promise((res, rej) =>
			ctx.req.session!.destroy((err) => {
				if (err) {
					console.log(err);
					return rej(false);
				}

				ctx.res.clearCookie("auth");
				return res(true);
			})
		);
	}
}
