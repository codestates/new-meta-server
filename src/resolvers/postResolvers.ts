import { Arg, Ctx, Mutation, Resolver, UseMiddleware } from "type-graphql";

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
}
