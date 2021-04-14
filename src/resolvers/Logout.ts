import { MyContext } from "./types/MyContext";
import { Ctx, Mutation, Resolver } from "type-graphql";

@Resolver()
export class LogoutResolver {
	@Mutation(() => Boolean)
	async logout(@Ctx() ctx: MyContext): Promise<Boolean> {
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
