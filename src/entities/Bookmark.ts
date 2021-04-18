// import { Field, ObjectType } from "type-graphql";
// import { BaseEntity, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

// import { User } from "./User";

// @ObjectType()
// @Entity({ name: "bookmarks" })
// export class Bookmark extends BaseEntity {
// 	@Field()
// 	@PrimaryGeneratedColumn("uuid")
// 	id: string;

// 	@ManyToOne(() => User, (user) => user.followerIds, { nullable: true })
// 	follower: User;

// 	@ManyToOne(() => User, (user) => user.followeeIds, { nullable: true })
// 	followee: User;
// }
