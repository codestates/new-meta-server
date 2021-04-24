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
		async (
			accessToken: string,
			refreshToken: string,
			profile: any,
			cb: any
		) => {
			// 이미 가입된 이메일인지 체크
			const existingUser = await User.findOne({ email: profile._json.email });
			if (existingUser) {
				const result = {
					id: existingUser.id,
					email: existingUser.email,
					nickname: existingUser.nickname,
					password: existingUser.password,
					accountType: existingUser.accountType,
				};
				return cb(null, result);
			} else {
				const user = await User.create({
					nickname: profile.displayName,
					email: profile._json.email,
					password: profile.id,
					accountType: "google",
				}).save();

				const findOne = await User.findOne({ email: profile._json.email });

				const result = {
					id: findOne?.id,
					email: findOne?.email,
					nickname: findOne?.nickname,
					password: findOne?.password,
					accountType: findOne?.accountType,
				};

				return cb(null, result);
			}
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
		(accessToken: string, refreshToken: string, profile: any, cb: any) => {}
	)
);

passport.use(
	new GitHubStrategy(
		{
			clientID: process.env.GITHUB_ID as string,
			clientSecret: process.env.GITHUB_SECRET as string,
			callbackURL: "/auth/github/callback",
		},
		(accessToken: string, refreshToken: string, profile: any, cb: any) => {}
	)
);

export default passport;
