import {
	Arg,
	Ctx,
	Mutation,
	Query,
	Resolver,
	UseMiddleware,
} from "type-graphql";

import { Post } from "../entities/Post";
import { isAuth } from "./middleware/isAuth";

import { MyContext } from "./types/MyContext";
import {
	CreatePostInputType,
	CreatePostResponseType,
} from "./types/postTypes/CreatePostType";

@Resolver()
export class CreatePostResolver {
	@Mutation(() => CreatePostResponseType)
	@UseMiddleware(isAuth)
	async createPost(
		@Arg("data")
		data: CreatePostInputType,
		@Ctx() { payload }: MyContext
	) {
		const post = await Post.create({
			...data,
			user: {
				id: payload!.userId,
				email: payload?.userEmail,
				nickname: payload?.userNickname,
			},
		}).save();

		return { ...post };
	}

	@Query(() => [Post])
	@UseMiddleware(isAuth)
	async readMyPosts(@Ctx() { payload }: MyContext) {
		console.log(payload?.userId);
		const posts = await Post.find({
			where: {
				user: payload?.userId,
			},
		});
		if (!posts) throw new Error("Item not found");

		return posts;
	}
}
