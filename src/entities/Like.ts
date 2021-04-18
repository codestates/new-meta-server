// import { Field, ObjectType } from "type-graphql";
// import { BaseEntity, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

// import { User } from "./User";
// import { Post } from "./Post";

// @ObjectType()
// @Entity({ name: "likes" })
// export class Like extends BaseEntity {
// 	@Field()
// 	@PrimaryGeneratedColumn("uuid")
// 	id: string;

// 	@ManyToOne(() => User, (user) => user.likes)
// 	user: User;

// 	@ManyToOne(() => Post, (post) => post.likes)
// 	post: Post;
// }
