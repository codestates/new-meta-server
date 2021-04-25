import {
	Arg,
	Ctx,
	Mutation,
	Query,
	Resolver,
	UseMiddleware,
} from "type-graphql";
import { getRepository } from "typeorm";
import bcrypt, { compare } from "bcryptjs";
import { sign } from "jsonwebtoken";
import { generateToken } from "../lib/jwt";

import { User } from "../entities/User";
import { Post } from "../entities/Post";
import { Like } from "../entities/Like";
import { Follow } from "../entities/Follow";

import { isAuth } from "./middleware/isAuth";
import { MyContext } from "./types/MyContext";
import {
	RegisterInputType,
	RegisterResponseType,
} from "./types/UserTypes/RegisterType";
import { LoginInputType, LoginResponseType } from "./types/UserTypes/LoginType";
import { UpdatePasswordType } from "./types/UserTypes/UpdatePasswordType";
import { LogoutResponseType } from "./types/UserTypes/LogoutType";
import { MyinfoResponseType } from "./types/UserTypes/MyInfoType";

@Resolver()
export class UserResolver {
	@Query(() => String)
	async hello() {
		return "hello world";
	}

	@Mutation(() => RegisterResponseType)
	async register(
		@Arg("data") { nickname, email, password }: RegisterInputType
	): Promise<User> {
		const checkEmail = await User.findOne({ email });
		if (checkEmail) throw new Error("Email already in use.");

		const checkNickname = await User.findOne({ nickname });
		if (checkNickname) throw new Error("Nickname already in use.");

		const hashedPassword = await bcrypt.hash(password, 8);
		const user = await User.create({
			nickname,
			email,
			password: hashedPassword,
		}).save();

		return user;
	}

	@Mutation(() => LoginResponseType)
	async login(
		@Arg("data") { email, password }: LoginInputType
	): Promise<LoginResponseType> {
		const user = await User.findOne({ where: { email } });
		if (!user) throw new Error("Email not found");

		const valid = await compare(password, user.password!);
		if (!valid) throw new Error("Check your password");

		return {
			token: generateToken(user.id, user.email!, user.nickname as string),
			user,
		};
	}

	@Mutation(() => LogoutResponseType)
	@UseMiddleware(isAuth)
	async logout(@Ctx() { payload }: MyContext) {
		const user = await User.findOne({ id: payload?.userId });
		const newToken = sign({ payload }, process.env.TOKEN_SECRET as string, {
			expiresIn: "1s",
		});

		return { token: newToken, message: "Logged out successfully.", user };
	}

	@Query(() => MyinfoResponseType)
	@UseMiddleware(isAuth)
	async myInfo(@Ctx() { payload }: MyContext) {
		const user = await User.findOne({ id: payload?.userId });

		const posts = await getRepository(Post)
			.createQueryBuilder("post")
			.leftJoinAndSelect("post.user", "user")
			.where({ user: payload?.userId })
			.orderBy("post.createdAt", "DESC")
			.getMany();

		const likes = await getRepository(Like)
			.createQueryBuilder("like")
			.leftJoinAndSelect("like.post", "post")
			.where({ user: payload?.userId })
			.orderBy("like.createdAt", "DESC")
			.getMany();

		const followings = await getRepository(Follow)
			.createQueryBuilder("follow")
			.innerJoinAndSelect("follow.target", "user")
			.where({ subject: payload?.userId })
			.orderBy("follow.createdAt", "DESC")
			.getMany();

		const followers = await getRepository(Follow)
			.createQueryBuilder("follow")
			.innerJoinAndSelect("follow.subject", "user")
			.where({ target: payload?.userId })
			.orderBy("follow.createdAt", "DESC")
			.getMany();

		return { user, posts, likes, followings, followers };
	}

	@Query(() => MyinfoResponseType)
	async userInfo(@Arg("userId") userId: string) {
		const user = await User.findOne({ id: userId });

		const posts = await getRepository(Post)
			.createQueryBuilder("post")
			.leftJoinAndSelect("post.user", "user")
			.where({ user: userId })
			.orderBy("post.createdAt", "DESC")
			.getMany();

		const likes = await getRepository(Like)
			.createQueryBuilder("like")
			.leftJoinAndSelect("like.post", "post")
			.where({ user: userId })
			.orderBy("like.createdAt", "DESC")
			.getMany();

		const followings = await getRepository(Follow)
			.createQueryBuilder("follow")
			.innerJoinAndSelect("follow.target", "user")
			.where({ subject: userId })
			.orderBy("follow.createdAt", "DESC")
			.getMany();

		const followers = await getRepository(Follow)
			.createQueryBuilder("follow")
			.innerJoinAndSelect("follow.subject", "user")
			.where({ target: userId })
			.orderBy("follow.createdAt", "DESC")
			.getMany();

		return { user, posts, likes, followings, followers };
	}

	@Mutation(() => User, { nullable: true })
	@UseMiddleware(isAuth)
	async changePassword(
		@Arg("data") { currentPassword, newPassword }: UpdatePasswordType,
		@Ctx() { payload }: MyContext
	) {
		const user = await User.findOne({ id: payload?.userId });
		if (!user) throw new Error("User not found");
		if (user.accountType !== "local")
			throw new Error("oAuth account's password can't be changed");

		const valid = bcrypt.compare(currentPassword, user.password!);
		if (!valid) throw new Error("Check your password");

		user.password = await bcrypt.hash(newPassword, 8);
		await user.save();

		return user;
	}

	@Mutation(() => Boolean, { nullable: true })
	@UseMiddleware(isAuth)
	async deleteAccount(
		@Arg("password") password: string,
		@Ctx() { payload }: MyContext
	) {
		const user = await User.findOne({ id: payload?.userId });
		if (!user) throw new Error("User not found");

		if (user.accountType === "local") {
			const valid = await bcrypt.compare(password, user.password!);
			if (!valid) throw new Error("Check your password");

			await user.remove();

			return true;
		} else {
			await user.remove();

			return true;
		}
	}

	@Mutation(() => User)
	@UseMiddleware(isAuth)
	async changeNickname(
		@Arg("newNickname") newNickname: String,
		@Ctx() { payload }: MyContext
	) {
		const user = await User.findOne({ id: payload?.userId });
		if (!user) throw new Error("User not found");
		const newUser = { ...user, nickname: newNickname };
		await Object.assign(user, newUser).save();
		return newUser;
	}
}
