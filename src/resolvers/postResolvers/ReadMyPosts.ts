// import { Post } from "../entities/Post";
// import { Ctx, Query, Resolver } from "type-graphql";
// import { MyContext } from "./types/MyContext";

// @Resolver()
// export class ReadMyPostsResolver {
// 	@Query(() => [Post])
// 	async readMyPosts(@Ctx() ctx: MyContext) {
// 		if (!ctx.req.session!.userId) throw new Error("Please login");

// 		const theUserId = ctx.req.session!.userId;

// 		const posts = await Post.find({
// 			where: {
// 				user: theUserId,
// 			},
// 		});
// 		if (!posts) throw new Error("Item not found");

// 		return posts;
// 	}
// }
