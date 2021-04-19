import { User } from "../entities/User";
import { MyContext } from "./types/MyContext";
import { Ctx, Query, Resolver, UseMiddleware } from "type-graphql";
import { isAuth } from "./middleware/isAuth";

@Resolver()
export class MeResolver {
	@Query(() => User, { nullable: true })
	@UseMiddleware(isAuth)
	async me(@Ctx() { payload }: MyContext) {
		try {
			console.log(payload);
			return await User.findOne({ where: { id: payload!.userId } });
		} catch (error) {
			return error;
		}
	}
}
