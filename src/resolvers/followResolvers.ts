import {
	Arg,
	Ctx,
	Mutation,
	Query,
	Resolver,
	UseMiddleware,
} from "type-graphql";

import { User } from "../entities/User";
import { Follow } from "../entities/Follow";

import { isAuth } from "./middleware/isAuth";
import { MyContext } from "./types/MyContext";
import { CreateFollowResponseType } from "./types/FollowTypes/CreateFollowResponseType";

@Resolver()
export class FollowResolver {
	@Mutation(() => CreateFollowResponseType)
	@UseMiddleware(isAuth)
	async createFollow(
		@Ctx() { payload }: MyContext,
		@Arg("targetId") targetId: string
	) {
		if (payload?.userId === targetId)
			throw new Error("You can't follow yourself");

		const check = await Follow.findOne({
			where: {
				subject: payload?.userId,
				target: targetId,
			},
		});
		if (check) throw new Error("You already followed the user");

		const findTargetUser = await User.findOne({ id: targetId });
		if (!findTargetUser) throw new Error("User not found");

		const subjectUser = await User.findOne({ id: payload?.userId });

		const follow = await Follow.create({
			subject: { id: payload?.userId },
			subjectNumber: payload?.userId,
			subjectEmail: payload?.userEmail,
			target: { id: targetId },
			targetNumber: targetId,
			targetEmail: findTargetUser.email,
		}).save();

		return {
			user: subjectUser,
			message: `${payload?.userEmail} follows ${findTargetUser.email} now`,
		};
	}

	@Mutation(() => Boolean)
	@UseMiddleware(isAuth)
	async deleteFollow(
		@Ctx() { payload }: MyContext,
		@Arg("targetId") targetId: string
	) {
		const follow = await Follow.findOne({
			where: {
				subject: payload?.userId,
				target: targetId,
			},
		});
		if (!follow) throw new Error("You haven't follow the user.");

		await follow.remove();

		return true;
	}

	@Query(() => [Follow])
	@UseMiddleware(isAuth)
	async readWhomIFollow(@Ctx() { payload }: MyContext) {
		const follow = await Follow.find({ where: { subject: payload?.userId } });

		return follow;
	}

	@Query(() => [Follow])
	@UseMiddleware(isAuth)
	async readWhoFollowsMe(@Ctx() { payload }: MyContext) {
		const follow = await Follow.find({ where: { target: payload?.userId } });

		return follow;
	}
}
