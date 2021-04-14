// import bcrypt from "bcryptjs";
// import { User } from "../entities/User";
// import { Arg, Ctx, Mutation, Resolver } from "type-graphql";
// import { ChangePasswordInput } from "./validation/ChangePasswordInput";
// import { redis } from "src/redis";
// import { MyContext } from "src/types/MyContext";

// @Resolver()
// export class ChangePasswordResolver {
// 	@Mutation(() => User, { nullable: true })
// 	async changePassword(
// 		@Arg("data") { currentPassword, newPassword }: ChangePasswordInput
//         @Ctx() ctx: MyContext
// 	): Promise<User | null> {
//         const userId = await redis.get(userId)

// 		const user = await User.findOne({ userId  });
// 		if (!user) return null;

// 		const valid = await bcrypt.compare(currentPassword, user.password);
// 		if (!valid) return null;

// 		user.password = await bcrypt.hash(newPassword, 8);
// 		await user.save();

// 		return user;
// 	}
// }
