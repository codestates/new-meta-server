import {
	Entity,
	PrimaryGeneratedColumn,
	Column,
	CreateDateColumn,
	ManyToOne,
	OneToMany,
} from "typeorm";
import { User } from "./User";
import { Like } from "./Like";

@Entity({ name: "posts" })
export class Post {
	@PrimaryGeneratedColumn()
	id: number;

	@Column()
	post_text: string;

	@Column()
	email: string;

	@CreateDateColumn()
	created_at: Date;

	@OneToMany(() => Like, (like) => like.post)
	likes: Like[];

	@ManyToOne(() => User, (user) => user.posts)
	user: User;
}
