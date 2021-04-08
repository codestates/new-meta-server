import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from "typeorm";
import { User } from "./User";

@Entity({ name: "bookmarks" })
export class Bookmark {
	@PrimaryGeneratedColumn()
	id: number;

	@Column()
	pair: string;

	@ManyToOne(() => User, (user) => user.bookmarks)
	user: User;
}
