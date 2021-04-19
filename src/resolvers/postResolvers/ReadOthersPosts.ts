// import { Post } from "../entities/Post";
// import { Arg, Query, Resolver } from "type-graphql";

// @Resolver()
// export class CuckooResolver {
// 	@Query(() => [Post], { nullable: true })
// 	async readOthersPosts(@Arg("userId") userId: string) {
// 		const posts = await Post.find({
// 			where: {
// 				user: userId,
// 			},
// 		});

// 		return posts;
// 	}
// }
