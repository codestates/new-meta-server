import bcrypt from "bcryptjs";
import { Arg, Ctx, Mutation, Resolver } from "type-graphql";
import { ChangePasswordInput } from "./types/inputs/ChangePasswordInput";
import { MyContext } from "./types/MyContext";

import { User } from "../entities/User";
@Resolver()
export class ChangePasswordResolver {
	@Mutation(() => User, { nullable: true })
	async changePassword(
		@Arg("data") { currentPassword, newPassword }: ChangePasswordInput,
		@Ctx() ctx: MyContext
	): Promise<User | any> {
		const userId = ctx.req.session!.userId;
		if (!userId) return undefined;

		const user = await User.findOne({ id: userId });
		if (!user) return null;

		const valid = bcrypt.compare(currentPassword, user.password);
		if (!valid) return null;

		user.password = await bcrypt.hash(newPassword, 8);
		await user.save();

		ctx.req.session!.userId = user.id;

		return user;
	}
}
