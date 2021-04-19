// import { Post } from "../entities/Post";
// import { Arg, Ctx, Mutation, Resolver } from "type-graphql";
// import { MyContext } from "./types/MyContext";

// @Resolver()
// export class DeletePostResolver {
// 	@Mutation(() => Boolean, { nullable: true })
// 	async deletePost(@Arg("postId") postId: string, @Ctx() ctx: MyContext) {
// 		if (!ctx.req.session!.userId) throw new Error("Please login");

// 		const post = await Post.findOne({
// 			where: { id: postId, user: ctx.req.session!.userId },
// 		});
// 		if (!post) throw new Error("Something went wrong");

// 		await post.remove();
// 		return true;
// 	}
// }
