import {
	Arg,
	Ctx,
	Mutation,
	Query,
	Resolver,
	UseMiddleware,
} from "type-graphql";

import { Like } from "../entities/Like";
import { User } from "../entities/User";
import { Post } from "../entities/Post";

import { isAuth } from "./middleware/isAuth";
import { CreateLikeResponseType } from "./types/LikeTypes/CreateLikeResponseType";
import { MyContext } from "./types/MyContext";
import { ReadMyLikesResponseType } from "./types/LikeTypes/ReadMyLikesResponseType";

@Resolver()
export class LikeResolver {
	@Mutation(() => CreateLikeResponseType)
	@UseMiddleware(isAuth)
	async createLike(
		@Ctx() { payload }: MyContext,
		@Arg("postId") postId: string
	) {
		const check = await Like.findOne({
			where: {
				user: payload?.userId,
				post: postId,
			},
		});
		if (check) throw new Error("You already liked the post.");

		const findUser = await User.findOne({ id: payload?.userId });
		const findPost = await Post.findOne({ id: postId });

		const like = await Like.create({
			post: { id: postId },
			user: { id: payload?.userId },
			postTitle: findPost!.title,
		}).save();

		return { post: findPost, user: findUser, like };
	}

	@Query(() => ReadMyLikesResponseType)
	@UseMiddleware(isAuth)
	async readMyLikes(@Ctx() { payload }: MyContext) {
		const myLikes = await Like.find({
			where: {
				user: payload?.userId,
			},
			order: {
				createdAt: "DESC",
			},
		});

		const post = await Post.find({});

		console.log(myLikes);

		const user = await User.findOne({ id: payload?.userId });

		return { user, likes: myLikes };
	}

	@Mutation(() => Boolean)
	@UseMiddleware(isAuth)
	async deleteLike(
		@Ctx() { payload }: MyContext,
		@Arg("postId") postId: string
	) {
		const likedPost = await Like.findOne({
			where: {
				user: payload?.userId,
				post: postId,
			},
		});
		if (!likedPost) throw new Error("You haven't liked the post.");

		await likedPost.remove();

		return true;
	}
}
