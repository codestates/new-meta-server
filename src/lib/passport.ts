import "dotenv/config";
import passport from "passport";
import * as passportGoogle from "passport-google-oauth20";
import * as passportFacebook from "passport-facebook";
import * as passportGithub from "passport-github2";

import { User } from "../entities/User";

const GoogleStrategy = passportGoogle.Strategy;
const FacebookStrategy = passportFacebook.Strategy;
const GitHubStrategy = passportGithub.Strategy;

passport.use(
	new GoogleStrategy(
		{
			clientID: process.env.GOOGLE_ID as string,
			clientSecret: process.env.GOOGLE_SECRET as string,
			callbackURL: "/auth/google/callback",
		},
		(accessToken: string, refreshToken: string, profile: any, cb: any) => {
			console.log("accessToken: ", accessToken);
			console.log("refreshToken: ", refreshToken);
			console.log("profile_google: ", profile);

			const email = profile.email;
			const nickname = profile.displayName;
			const password = profile.id;
			const accountType = "google";

			// DB에 존재하는 email, accountType 모두 일치
			const existingUser = User.findOne({
				where: { email, accountType },
			});
			if (existingUser) return cb(null, existingUser);

			// DB에 email 존재하지 않음.
			const result = User.create({
				email,
				nickname,
				password,
				accountType,
			}).save();

			return cb(null, result);
		}
	)
);

passport.use(
	new FacebookStrategy(
		{
			clientID: process.env.FACEBOOK_ID as string,
			clientSecret: process.env.FACEBOOK_SECRET as string,
			callbackURL: "/auth/facebook/callback",
		},
		async (
			accessToken: string,
			refreshToken: string,
			profile: any,
			cb: any
		) => {
			console.log("profile_facebook: ", profile);
			const email = profile.email;
			const nickname = profile.displayName;
			const password = profile.id;
			const accountType = "facebook";

			// DB에 존재하는 email, accountType 모두 일치
			const existingUser = await User.findOne({
				where: { email, accountType },
			});
			if (existingUser) return cb(null, existingUser);

			// DB에 email 존재하지 않음.
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

passport.use(
	new GitHubStrategy(
		{
			clientID: process.env.GITHUB_ID as string,
			clientSecret: process.env.GITHUB_SECRET as string,
			callbackURL: "/auth/github/callback",
		},
		async (
			accessToken: string,
			refreshToken: string,
			profile: any,
			cb: any
		) => {
			console.log("profile_github: ", profile);
			const email = profile.email;
			const nickname = profile.displayName;
			const password = profile.id;
			const accountType = "github";

			// DB에 존재하는 email, accountType 모두 일치
			const existingUser = await User.findOne({
				where: { email, accountType },
			});
			if (existingUser) return cb(null, existingUser);

			// DB에 email 존재하지 않음.
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

export default passport;
