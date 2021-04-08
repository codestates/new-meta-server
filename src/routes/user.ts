import { Router } from "express";
import { checkJwt } from "../controllers/middleware/checkjwt";
import UserController from "../controllers/UserController";

const router = Router();

router.post("/", UserController.userCreate);
router.post("/login", UserController.userLogin);
// router.post("/logout", [checkJwt], UserController.userLogout);

export default router;
