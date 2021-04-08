import { Request, Response, NextFunction } from "express";
import { getRepository } from "typeorm";
import * as jwt from "jsonwebtoken";
import * as dotenv from "dotenv";
dotenv.config();
import { User } from "../../entity/User";

export const checkJwt = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	try {
		const token = req.headers.authorization.split(" ")[1];
		const decoded = jwt.verify(token, process.env.TOKEN_SECRET);
		const userRepository = getRepository(User);
		const user = await userRepository.findOne({
			email: decoded.email,
		});

		if (!user) {
			throw new Error();
		}

		console.log("middleware 통과");
		next();
	} catch (error) {
		res.status(401).send({ error: "Please authenticate." });
	}
};
