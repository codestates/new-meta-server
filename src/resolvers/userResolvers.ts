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
import { generateToken } from "../lib/jwt";
import { isAuth } from "./middleware/isAuth";

import { MyContext } from "./types/MyContext";
import { RegisterType } from "./types/userTypes/RegisterType";
import {
	LoginInputType,
	LoginResponseType,
} from "./types/userTypes/UserLoginType";
import { UpdatePasswordType } from "./types/userTypes/UpdatePasswordType";

@Resolver()
export class UserResolver {
	@Query(() => String)
	async hello() {
		return "hello world";
	}

	@Mutation(() => User)
	async register(
		@Arg("data") { nickname, email, password }: RegisterType
	): Promise<User> {
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

		return { token: generateToken(user.id), user };
	}

	@Mutation(() => String)
	@UseMiddleware(isAuth)
	async logout(@Ctx() { payload }: MyContext) {
		try {
			const newToken = sign({ payload }, process.env.TOKEN_SECRET as string, {
				expiresIn: "1s",
			});

			return newToken;
		} catch (error) {
			throw new Error("Something went wrong");
		}
	}

	@Query(() => User, { nullable: true })
	@UseMiddleware(isAuth)
	async me(@Ctx() { payload }: MyContext) {
		try {
			return await User.findOne({ where: { id: payload!.userId } });
		} catch (error) {
			return error;
		}
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
}
