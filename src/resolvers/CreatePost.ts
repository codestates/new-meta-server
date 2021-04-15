import { Post } from "../entities/Post";
import { Arg, Ctx, Mutation, Resolver } from "type-graphql";
import { CreatePostInput } from "./types/inputs/CreatePostInput";
import { MyContext } from "./types/MyContext";

@Resolver()
export class CreatePostResolver {
	@Mutation(() => Post)
	async createPost(
		@Arg("data")
		{ champion, title, description, skills, play, etc }: CreatePostInput,
		@Ctx() ctx: MyContext
	): Promise<Post | null> {
		if (!ctx.req.session!.userId) return null;

		const post = await Post.create({
			champion,
			title,
			description,
			skills,
			play,
			etc,
			user: ctx.req.session!.userId,
		}).save();

		return post;
	}
}
