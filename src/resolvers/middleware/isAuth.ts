import { MiddlewareFn } from "type-graphql";
import { verify } from "jsonwebtoken";
import { MyContext } from "../types/MyContext";
import dotenv from "dotenv";
dotenv.config();

export const isAuth: MiddlewareFn<MyContext> = ({ context }, next) => {
	const authorization = context.req.headers["authorization"];

	if (!authorization) {
		throw new Error("Please login");
	}

	try {
		const token = authorization.split(" ")[1];
		const payload = verify(token, process.env.TOKEN_SECRET as string);
		console.log(payload);
		context.payload = payload as any;
	} catch (err) {
		console.log(err);
		throw new Error("Please login");
	}
	return next();
};
