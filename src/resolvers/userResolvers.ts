import {
	Arg,
	Ctx,
	Mutation,
	Query,
	Resolver,
	UseMiddleware,
} from "type-graphql";
import bcrypt, { compare } from "bcryptjs";
import { sign } from "jsonwebtoken";

import { User } from "../entities/User";
import { Post } from "../entities/Post";
import { generateToken } from "../lib/jwt";
import { isAuth } from "./middleware/isAuth";

import { MyContext } from "./types/MyContext";
import {
	RegisterInputType,
	RegisterResponseType,
} from "./types/userTypes/RegisterType";
import { LoginInputType, LoginResponseType } from "./types/userTypes/LoginType";
import { UpdatePasswordType } from "./types/userTypes/UpdatePasswordType";
import { LogoutResponseType } from "./types/UserTypes/LogoutTYpe";
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

		const valid = await compare(password, user.password);
		if (!valid) throw new Error("Check your password");

		return { token: generateToken(user.id, user.email, user.nickname), user };
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
		const posts = await Post.find({ where: { user: payload?.userId } });

		return { user, posts };
	}

	@Mutation(() => User, { nullable: true })
	@UseMiddleware(isAuth)
	async changePassword(
		@Arg("data") { currentPassword, newPassword }: UpdatePasswordType,
		@Ctx() { payload }: MyContext
	) {
		const user = await User.findOne({ id: payload?.userId });
		if (!user) throw new Error("User not found");

		const valid = bcrypt.compare(currentPassword, user.password);
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
		if (!user) return null;

		const valid = await bcrypt.compare(password, user.password);
		if (!valid) return null;

		await user.remove();

		return true;
	}

	@Mutation(() => User)
	@UseMiddleware(isAuth)
	async changeNickname(
		@Arg("newNickname") newNickname : String,
		@Ctx() { payload }: MyContext
	) {
		const user = await User.findOne({ id: payload?.userId });
		if (!user) throw new Error("User not found");
		const newUser = {...user, nickname: newNickname}
		await Object.assign(user, newUser).save();
		return newUser;
	}
}
