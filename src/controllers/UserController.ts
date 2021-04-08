import { Request, Response } from "express";
import { getRepository } from "typeorm";
import { User } from "../entity/User";
import * as jwt from "jsonwebtoken";
import * as dotenv from "dotenv";
dotenv.config();

class UserController {
	static userCreate = async (req: Request, res: Response) => {
		const { nickname, email, password } = req.body;

		let user = new User();
		user.nickname = nickname;
		user.email = email;
		user.password = password;

		user.hashPassword();

		const token = jwt.sign(
			{ user: user.email.toString() },
			process.env.TOKEN_SECRET
		);

		const userRepository = getRepository(User);
		try {
			const checkEmail = await userRepository.findOne({ email });
			if (checkEmail) {
				return res.status(409).send({ message: "email already exists" });
			}

			const checkNickname = await userRepository.findOne({ nickname });
			if (checkNickname) {
				return res.status(409).send({ message: "nickname already exists" });
			}

			await userRepository.save(user);
			delete user.password;
		} catch (error) {
			return res.status(500).send(error);
		}
		res.status(201).send({ user, token });
	};

	static userLogin = async (req: Request, res: Response) => {
		const { email, password } = req.body;

		if (!email || !password) {
			res.status(400).send({ message: "email and password can't be blank" });
		}

		const userRepository = getRepository(User);
		let user: User;
		try {
			user = await userRepository.findOneOrFail({ where: { email } });
		} catch (error) {
			res.status(401).send({ message: "unauthorized" });
		}

		if (!user.checkPassword(password)) {
			res.status(401).send({ message: "unauthorized" });
			return;
		}

		const token = jwt.sign(
			{ user: user.email.toString() },
			process.env.TOKEN_SECRET,
			{ expiresIn: "1d" }
		);

		delete user.password;

		res.send({ user, token });
	};

	// static userLogout = async (req: Request, res: Response) => {
	// 	try {
	// 		const userRepository = getRepository(User);
	// 		let user: User;
	// 		req.body.token = "";
	// 		await userRepository.save(user);
	// 		res.send();
	// 	} catch (error) {
	// 		res.status(500).send(error);
	// 	}
	// };
}

export default UserController;
