import "dotenv/config";
import passport from "passport";
import * as passportGoogle from "passport-google-oauth20";
import { User } from "../entities/User";

const GoogleStrategy = passportGoogle.Strategy;

passport.use(
	new GoogleStrategy(
		{
			clientID: process.env.GOOGLE_ID as string,
			clientSecret: process.env.GOOGLE_SECRET as string,
			callbackURL: "/auth/google/callback",
		},
		async (
			accessToken: string,
			refreshToken: string,
			profile: any,
			cb: any
		) => {
			console.log("profile: ", profile);
			const email = profile.email;
			const nickname = profile.displayName;
			const password = profile.id;
			const accountType = "facebook";

			// 1. DB에 존재하는 email, accountType 모두 일치
			const existingUser = await User.findOne({
				where: { email, accountType },
			});
			if (existingUser) return cb(null, existingUser);

			// 2. DB에 존재하는 email만 일치
			const emailIdentified = await User.findOne({ email });
			if (emailIdentified)
				throw new Error("Email already in use. Please try to login otherwise.");

			// 3. DB에 email 존재하지 않음.
			const result = await User.create({
				email,
				nickname,
				password,
				accountType,
			}).save();

			return cb(null, result);
		}
	)
);
