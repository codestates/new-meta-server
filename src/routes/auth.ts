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
		failureRedirect: "https://new-meta.ga",
		session: false,
	}),
	function (req: Request, res: Response) {
		const userData: any = req.user;
		const { id, email, nickname } = userData;

		const token = generateToken(id, email, nickname);

		res.redirect(`https://new-meta.ga/?token=${token}`);
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
		failureRedirect: "https://new-meta.ga",
		session: false,
	}),
	function (req, res) {
		const userData: any = req.user;
		const { id, email, nickname } = userData;

		const token = generateToken(id, email, nickname);

		res.redirect(`https://new-meta.ga/?token=${token}`);
	}
);

router.get(
	"/github",
	passport.authenticate("github", { scope: ["user:email"], session: false })
);
router.get(
	"/github/callback",
	passport.authenticate("github", {
		failureRedirect: "https://new-meta.ga",
		session: false,
	}),
	function (req, res) {
		const userData: any = req.user;
		const { id, email, nickname } = userData;

		const token = generateToken(id, email, nickname);

		res.redirect(`https://new-meta.ga/?token=${token}`);
	}
);

export default router;
