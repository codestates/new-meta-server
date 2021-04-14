import { Field, ObjectType } from "type-graphql";
import {
  BaseEntity,
  Column,
  Entity,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from "typeorm";

import { OpenAuth } from "./OpenAuth";
import { Post } from "./Post";
import { Bookmark } from "./Bookmark";
import { Like } from "./Like";

@ObjectType()
@Entity({ name: "users" })
export class User extends BaseEntity {
  @Field()
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Field()
  @Column()
  nickname!: string;

  @Field()
  @Column()
  email!: string;

  @Column()
  password!: string;

  @OneToOne(() => OpenAuth, (openAuth) => openAuth.user)
  openAuth?: OpenAuth;

  @Field(() => [Post], { nullable: true })
  @OneToMany(() => Post, (post) => post.user, { nullable: true })
  posts: Post[] | null;

  @Field(() => [Bookmark], { nullable: true })
  @OneToMany(() => Bookmark, (bookmark) => bookmark.follower)
  followerIds: Bookmark[];

  @Field(() => [Bookmark], { nullable: true })
  @OneToMany(() => Bookmark, (bookmark) => bookmark.followee)
  followeeIds: Bookmark[];

  @Field(() => [Like], { nullable: true })
  @OneToMany(() => Like, (like) => like.user)
  likes: Like[];
}
