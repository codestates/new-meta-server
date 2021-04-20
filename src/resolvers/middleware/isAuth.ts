import { verifyToken } from "../../lib/jwt";
import { MiddlewareFn } from "type-graphql";
import { MyContext } from "../types/MyContext";

export const isAuth: MiddlewareFn<MyContext> = ({ context }, next) => {
	const { authorization } = context.req.headers;

	if (!authorization) throw new Error("Please login again");

	try {
		const token = authorization.split(" ")[1];
		const payload = verifyToken(token);
		context.payload = payload as any;
	} catch (err) {
		console.log(err);
		throw new Error("Please login again");
	}
	return next();
};
