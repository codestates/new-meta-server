"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const UserController_1 = require("../controllers/UserController");
const router = express_1.Router();
router.post("/", UserController_1.default.userCreate);
router.post("/login", UserController_1.default.userLogin);
// router.post("/logout", [checkJwt], UserController.userLogout);
exports.default = router;
//# sourceMappingURL=user.js.map