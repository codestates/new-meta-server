import { Router } from "express";
const router = Router();

import { Request, Response } from "express";
import passport from "passport";
import { generateToken } from "../lib/jwt";

router.get(
	"/google",
	passport.authenticate("google", {
		scope: ["profile", "email"],
		session: false,
	})
);
router.get(
	"/google/callback",
	passport.authenticate("google", {
		failureRedirect: "http://localhost:3000",
		session: false,
	}),
	function (req: Request, res: Response) {
		const userData: any = req.user;
		const { id, email, nickname } = userData;

		const token = generateToken(id, email, nickname);

		res.redirect(`http://localhost:3000/?token=${token}`);
	}
);

router.get(
	"/facebook",
	passport.authenticate("facebook", {
		session: false,
	})
);
router.get(
	"/facebook/callback",
	passport.authenticate("facebook", {
		failureRedirect: "http://localhost:3000",
		session: false,
	}),
	function (req, res) {
		const userData: any = req.user;
		const { id, email, nickname } = userData;

		const token = generateToken(id, email, nickname);

		res.redirect(`http://localhost:3000/?token=${token}`);
	}
);

router.get(
	"/github",
	passport.authenticate("github", { scope: ["user:email"], session: false })
);
router.get(
	"/github/callback",
	passport.authenticate("github", {
		failureRedirect: "http://localhost:3000",
		session: false,
	}),
	function (req, res) {
		const userData: any = req.user;
		const { id, email, nickname } = userData;

		const token = generateToken(id, email, nickname);

		res.redirect(`http://localhost:3000/?token=${token}`);
	}
);

export default router;
