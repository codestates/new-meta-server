import { Entity, PrimaryGeneratedColumn, ManyToOne } from "typeorm";
import { Post } from "./Post";
import { User } from "./User";

@Entity({ name: "likes" })
export class Like {
	@PrimaryGeneratedColumn()
	id: number;

	@ManyToOne(() => Post, (post) => post.likes)
	post: Post;

	@ManyToOne(() => User, (user) => user.likes)
	user: User;
}
