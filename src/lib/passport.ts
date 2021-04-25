import "dotenv/config";
import passport from "passport";
import * as passportGoogle from "passport-google-oauth20";
import * as passportFacebook from "passport-facebook";
import * as passportGithub from "passport-github";

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
			profileFields: ["id", "displayName", "email"],
		},
		async (
			accessToken: string,
			refreshToken: string,
			profile: any,
			cb: any
		) => {
			// 이미 가입된 이메일인지 체크
			const existingUser = await User.findOne({
				email: `${profile.id}@facebook.com`,
			});
			if (existingUser) {
				const result = {
					id: existingUser.id,
					email: existingUser.id,
					nickname: existingUser.nickname,
					password: existingUser.password,
					accountType: existingUser.accountType,
				};
				return cb(null, result);
			} else {
				const user = await User.create({
					nickname: profile.displayName,
					email: `${profile.id}@facebook.com`,
					password: profile.id,
					accountType: "facebook",
				}).save();

				const findOne = await User.findOne({
					email: `${profile.id}@facebook.com`,
				});

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
			console.log(profile._json.email);
			console.log(profile.username);
			// 이미 가입된 이메일인지 체크
			const existingUser = await User.findOne({
				email: profile._json.email || `${profile.username}@github.com`,
			});
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
				// 깃헙은 유저네임으로도 가입할 수 있고, 이메일로도 가입할 수 있다.
				// 우리 사이트는 이메일이 식별자이기 때문에 유저네임으로 가입한 경우 임의의 이메일을 만들어줘야 한다. -> example@newmeta.com
				if (profile._json.email) {
					const user = await User.create({
						nickname: profile.username,
						email: profile._json.email,
						password: profile.id,
						accountType: "github",
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
				} else {
					const user = await User.create({
						nickname: profile.username,
						email: `${profile.username}@github.com`,
						password: profile.id,
						accountType: "github",
					}).save();

					const findOne = await User.findOne({
						email: `${profile.username}@github.com`,
					});

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
		}
	)
);

export default passport;
