import { sign, verify } from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

export function generateToken(id: string, email: string, nickname: string) {
	return sign(
		{ userId: id, userEmail: email, userNickname: nickname },
		process.env.TOKEN_SECRET!,
		{ expiresIn: "40d" }
	);
}

export function verifyToken(token: string) {
	return verify(token, process.env.TOKEN_SECRET!);
}
