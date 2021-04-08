import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from "typeorm";
import { Bookmark } from "./Bookmark";
import { Post } from "./Post";
import { Like } from "./Like";
import * as bcrypt from "bcryptjs";

@Entity({ name: "users" })
export class User {
	@PrimaryGeneratedColumn()
	id: number;

	@Column()
	nickname: string;

	@Column()
	email: string;

	@Column()
	password: string;

	@OneToMany(() => Post, (post) => post.user)
	posts: Post[];

	@OneToMany(() => Bookmark, (bookmark) => bookmark.user)
	bookmarks: Bookmark[];

	@OneToMany(() => Like, (like) => like.user)
	likes: Like[];

	hashPassword() {
		this.password = bcrypt.hashSync(this.password, 8);
	}

	checkPassword(hashedPassword: string) {
		return bcrypt.compareSync(hashedPassword, this.password);
	}
}
