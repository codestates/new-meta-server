import { Request, Response } from "express";
import { getRepository } from "typeorm";
import { User } from "../entity/User";
import * as jwt from "jsonwebtoken";
import * as bcrypt from "bcryptjs";
import * as dotenv from "dotenv";
dotenv.config();

class UserController {
	static userCreate = async (req: Request, res: Response) => {
		const { nickname, email, password } = req.body;

		// 빈 요청값이 없는지 확인
		if (!nickname || !email || !password) {
			return res
				.status(422)
				.send({ message: "Nickname, email and password can't be blank" });
		}

		// 닉네임 중복검사
		const checkNickname = await getRepository(User)
			.createQueryBuilder()
			.where({ nickname })
			.getOne();
		if (checkNickname) {
			return res.status(409).send({ message: "Nickname already exists" });
		}

		// 이메일 중복검사
		const checkEmail = await getRepository(User)
			.createQueryBuilder()
			.where({ email })
			.getOne();
		if (checkEmail) {
			return res.status(409).send({ message: "Email already exists" });
		}

		// DB에 넣을 값
		let user = new User();
		user.nickname = nickname;
		user.email = email;
		user.password = password;
		user.hashPassword();

		// INSERT 쿼리
		const queryExecution = await getRepository(User)
			.createQueryBuilder()
			.insert()
			.into(User)
			.values(user)
			.execute();

		delete user.password;

		res.send({ user, message: "Account created successfully" });
	};

	static userLogin = async (req: Request, res: Response) => {
		const { email, password } = req.body;

		// 빈 요청값이 있는지 확인
		if (!email || !password) {
			return res
				.status(422)
				.send({ message: "Email and password can't be blank" });
		}

		// DB에서 해당 유저 정보 찾기
		const user = await getRepository(User)
			.createQueryBuilder()
			.where({ email })
			.getOne();

		// 이메일에 해당하는 유저 있는지 확인
		if (!user) {
			return res.status(400).send({ message: "Check your email or password" });
		}

		// 비밀번호 맞는지 확인
		if (!user.checkPassword(password)) {
			return res.status(400).send({ message: "Check your email or password" });
		}

		// 토큰 발급
		const token = jwt.sign(
			{
				id: user.id.toString(),
				email: user.email.toString(),
				nickname: user.nickname.toString(),
			},
			process.env.TOKEN_SECRET,
			{
				expiresIn: "15 days",
			}
		);

		delete user.password;

		res.send({ user, token });
	};

	static userLogout = async (req: Request, res: Response) => {
		const { email } = req.body;

		// 토큰이 없는 경우
		if (!req.headers.authorization) {
			return res.status(401).send({ message: "Please login again" });
		}

		// 토큰 확인 된 경우
		const token = req.headers.authorization.split(" ")[1];
		try {
			const decoded = jwt.verify(token, process.env.TOKEN_SECRET);

			const user = await getRepository(User)
				.createQueryBuilder()
				.where({ email })
				.getOne();

			// 새 토큰 발급
			const newToken = jwt.sign(
				{ email: user.email.toString() },
				process.env.TOKEN_SECRET,
				{ expiresIn: "1s" }
			);

			delete user.password;

			return res.send({ user, message: "Logged out successfully" });
		} catch (error) {
			// 토큰이 다른 경우
			return res.status(400).send({ message: "Wrong access" });
		}
	};

	static userReadProfile = async (req: Request, res: Response) => {
		const { nickname, email, password } = req.body;

		// 토큰이 없는 경우
		if (!req.headers.authorization) {
			return res.status(401).send({ message: "Please login again" });
		}

		// 토큰 확인 된 경우
		const token = req.headers.authorization.split(" ")[1];
		try {
			const decoded = jwt.verify(token, process.env.TOKEN_SECRET);

			const user = await getRepository(User)
				.createQueryBuilder()
				.where({ email })
				.getOne();

			delete user.password;

			res.send({ user });
		} catch (error) {
			// 토큰이 다른 경우
			return res.status(400).send({ message: "Wrong access" });
		}
	};

	static userPasswordUpdate = async (req: Request, res: Response) => {
		const { email, currentPassword, newPassword } = req.body;

		// 공란 있는지 확인
		if (!currentPassword || !newPassword) {
			return res.status(400).send({
				message: "Please enter both your current password and the new one",
			});
		}

		// 현 비밀번호 제대로 입력했는지 확인
		const passwordMatch = await getRepository(User)
			.createQueryBuilder()
			.where({ email })
			.getOne();

		if (!passwordMatch.checkPassword(currentPassword)) {
			return res
				.status(400)
				.send({ message: "Please check your current password" });
		}

		// 토큰이 없는 경우
		if (!req.headers.authorization) {
			return res.status(401).send({ message: "Please login again" });
		}

		// 토큰 확인
		const token = req.headers.authorization.split(" ")[1];
		let decoded: any;
		try {
			decoded = jwt.verify(token, process.env.TOKEN_SECRET);
		} catch (error) {
			// 토큰이 다른 경우
			return res.status(400).send({ message: "Wrong access" });
		}

		const hashedNewPassword = bcrypt.hashSync(newPassword, 8);
		const user = await getRepository(User)
			.createQueryBuilder()
			.update(User)
			.set({ password: hashedNewPassword })
			.where({ email })
			.execute();

		const result = await getRepository(User)
			.createQueryBuilder()
			.where({ email })
			.getOne();

		delete result.password;

		res.send({ user: result, message: "Password changed successfully" });
	};

	static userDelete = async (req: Request, res: Response) => {
		const { email, password } = req.body;

		// 토큰이 없는 경우
		if (!req.headers.authorization) {
			res.status(401).send({ message: "Please login again" });
		}

		// 현 비밀번호 제대로 입력했는지 확인
		const user = await getRepository(User)
			.createQueryBuilder()
			.where({ email })
			.getOne();

		if (!user.checkPassword(password)) {
			return res
				.status(400)
				.send({ message: "Please check your current password" });
		}

		// 토큰 확인
		const token = req.headers.authorization.split(" ")[1];
		try {
			const decoded = jwt.verify(token, process.env.TOKEN_SECRET);

			const user = await getRepository(User)
				.createQueryBuilder()
				.delete()
				.where({ email })
				.execute();

			res.send({ message: "Account deleted successfully" });
		} catch (error) {
			// 토큰이 다른 경우
			return res.status(400).send({ message: "Wrong access" });
		}
	};
}

export default UserController;
