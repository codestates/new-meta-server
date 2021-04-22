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
import { getRepository } from "typeorm";

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

		const findTargetUser = await User.findOne({ id: targetId });
		if (!findTargetUser) throw new Error("User not found");

		const check = await Follow.findOne({
			where: {
				subject: payload?.userId,
				target: targetId,
			},
		});
		if (check) throw new Error("You already followed the user");

		const subjectUser = await User.findOne({ id: payload?.userId });

		const follow = await Follow.create({
			subject: { id: payload?.userId },
			target: { id: targetId },
		}).save();

		return {
			subject: subjectUser,
			target: findTargetUser,
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
		const result = await getRepository(Follow)
			.createQueryBuilder("follow")
			.innerJoinAndSelect("follow.target", "user")
			.where({ subject: payload?.userId })
			.orderBy("follow.createdAt", "DESC")
			.getMany();

		return result;
	}

	@Query(() => [Follow])
	@UseMiddleware(isAuth)
	async readWhoFollowsMe(@Ctx() { payload }: MyContext) {
		const result = await getRepository(Follow)
			.createQueryBuilder("follow")
			.innerJoinAndSelect("follow.subject", "user")
			.where({ target: payload?.userId })
			.orderBy("follow.createdAt", "DESC")
			.getMany();

		return result;
	}
}
