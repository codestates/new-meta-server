import { Router } from "express";
import UserController from "../controllers/UserController";

const router = Router();

router.post("/", UserController.userCreate);
router.post("/login", UserController.userLogin);
router.post("/logout", UserController.userLogout);
router.get("/me", UserController.userReadProfile);
router.patch("/me", UserController.userPasswordUpdate);
router.delete("/me", UserController.userDelete);

export default router;
