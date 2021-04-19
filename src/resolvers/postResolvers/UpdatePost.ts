// import { Post } from "../entities/Post";
// import { Arg, Ctx, Mutation, Query, Resolver } from "type-graphql";
// import { UpdatePostInput } from "./types/inputs/UpdatePostInput";
// import { MyContext } from "./types/MyContext";

// @Resolver()
// export class UpdatePostResolver {
// 	@Mutation(() => Post)
// 	async updatePost(
// 		@Arg("data") data: UpdatePostInput,
// 		@Ctx() ctx: MyContext
// 	): Promise<Post | undefined> {
// 		if (!ctx.req.session!.userId) throw new Error("Please login");

// 		const post = await Post.findOne({
// 			where: { id: data.id },
// 		});

// 		Object.assign(post, data);
// 		post?.save();

// 		return post;
// 	}
// }
