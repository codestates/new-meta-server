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
import { timeStamp } from 'console';
import { getRepository } from 'typeorm';

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

		const newLike = new Like();
		if(findPost && findUser){
			newLike.post = findPost;
			newLike.user = findUser
		}

		Like.save(newLike);
		

		// const like = await Like.create({
		// 	post: { id: postId },
		// 	user: { id: payload?.userId },
		// }).save();

		const newNumberOfLikes = findPost!.numberOfLikes + 1;

		await Object.assign(findPost, {
			...findPost,
			numberOfLikes: newNumberOfLikes,
		}).save();

		return { post: findPost, user: findUser, newLike };
	}

	@Query(() => ReadMyLikesResponseType)
	@UseMiddleware(isAuth)
	async readMyLikes(@Ctx() { payload }: MyContext) {
		const result = await getRepository(Like)
		.createQueryBuilder("like")
		.leftJoinAndSelect("like.post", "post")
		.where({user: payload?.userId,})
		.getMany();

		// const myLikes = await result.find({
		// 	where: {
		// 		user: payload?.userId,
		// 	},
		// 	order: {
		// 		createdAt: "DESC",
		// 	},
		// });

		// console.log(myLikes);
		

		const user = await User.findOne({ id: payload?.userId });

		return { user, likes: result };
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

		const findPost = await Post.findOne({ id: postId });
		const newNumberOfLikes = findPost!.numberOfLikes - 1;
		await Object.assign(findPost, {
			...findPost,
			numberOfLikes: newNumberOfLikes,
		}).save();

		await likedPost.remove();

		return true;
	}
}
