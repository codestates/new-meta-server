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
import { ReadOthersPostsByResponseType } from "./types/PostTypes/ReadOthersPostsByType";

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
			author: payload?.userNickname,
			user: {
				id: payload!.userId,
			},
		}).save();

		const user = await User.findOne({ id: payload?.userId });

		return { ...post, user };
	}

	@Query(() => [Post])
	@UseMiddleware(isAuth)
	async readMyPosts(@Ctx() { payload }: MyContext) {
		console.log(payload?.userId);
		const posts = await Post.find({
			where: {
				user: payload?.userId,
			},
			order: {
				createdAt: "DESC",
			},
		});
		if (!posts) throw new Error("Item not found");

		return posts;
	}

	@Query(() => ReadOthersPostsByResponseType, { nullable: true })
	async readOthersPostsByEmail(@Arg("email") email: string) {
		const user = await User.findOne({ email });
		if (!user) throw new Error("User not found.");

		const posts = await Post.find({
			where: {
				user: user.id,
			},
			order: {
				createdAt: "DESC",
			},
		});

		return { user, posts };
	}

	@Query(() => ReadOthersPostsByResponseType, { nullable: true })
	async readOthersPostsByNickname(@Arg("nickname") nickname: string) {
		const user = await User.findOne({ nickname });
		if (!user) throw new Error("User not found.");

		const posts = await Post.find({
			where: {
				user: user.id,
			},
			order: {
				createdAt: "DESC",
			},
		});

		return { user, posts };
	}

	@Query(() => [Post], { nullable: true })
	async fetchAllPosts() {
		const posts = await Post.find({
			order: {
				createdAt: "DESC",
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
		const post = await Post.findOne({
			where: { id: data.id, user: payload?.userId },
		});
		if (!post) throw new Error("You can't update the post");

		const newPost = { ...data };
		await Object.assign(post, newPost).save();

		const user = await User.findOne({ id: payload?.userId });

		return { ...post, user };
	}

	@Mutation(() => Boolean, { nullable: true })
	@UseMiddleware(isAuth)
	async deletePost(
		@Arg("postId") postId: string,
		@Ctx() { payload }: MyContext
	) {
		const post = await Post.findOne({
			where: {
				id: postId,
				user: payload?.userId,
			},
		});
		if (!post) throw new Error("You can't delete the post.");

		await post.remove();
		return true;
	}
}
