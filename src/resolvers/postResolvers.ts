import {
	Arg,
	Ctx,
	Mutation,
	Query,
	Resolver,
	UseMiddleware,
} from "type-graphql";

import { User } from "../entities/User";
import { Post } from "../entities/Post";
import { isAuth } from "./middleware/isAuth";

import { MyContext } from "./types/MyContext";
import {
	CreatePostInputType,
	CreatePostResponseType,
} from "./types/postTypes/CreatePostType";
import {
	UpdatePostInputType,
	UpdatePostResponseType,
} from "./types/postTypes/UpdatePostType";

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

	@Query(() => [Post], { nullable: true })
	async readOthersPosts(@Arg("email") email: string) {
		const arrayedUserInfo = await User.find({
			where: { email },
		});

		const [userInfo] = arrayedUserInfo;

		const posts = await Post.find({
			where: {
				user: userInfo.id,
			},
		});

		return posts;
	}

	@Mutation(() => UpdatePostResponseType)
	@UseMiddleware(isAuth)
	async updatePost(
		@Arg("data") data: UpdatePostInputType,
		@Ctx() { payload }: MyContext
	) {
		const arrayedPost = await Post.find({
			where: {
				user: payload?.userId,
				id: data.id,
			},
		});
		if (arrayedPost.length === 0) throw new Error("Post not found");

		const [post] = arrayedPost;

		const newPost = {
			...data,
			user: {
				id: payload!.userId,
				email: payload?.userEmail,
				nickname: payload?.userNickname,
			},
		};

		await Object.assign(post, newPost).save();

		return { ...newPost };
	}

	@Mutation(() => Boolean, { nullable: true })
	@UseMiddleware(isAuth)
	async deletePost(
		@Arg("postId") postId: string,
		@Ctx() { payload }: MyContext
	) {
		const arrayedPost = await Post.find({
			where: {
				id: postId,
				user: payload?.userId,
			},
		});
		if (arrayedPost.length === 0) throw new Error("Something went wrong.");

		const [post] = arrayedPost;

		await post.remove();
		return true;
	}
}
