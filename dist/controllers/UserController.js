"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const typeorm_1 = require("typeorm");
const User_1 = require("../entity/User");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
dotenv.config();
class UserController {
}
UserController.userCreate = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { nickname, email, password } = req.body;
    let user = new User_1.User();
    user.nickname = nickname;
    user.email = email;
    user.password = password;
    user.hashPassword();
    const token = jwt.sign({ user: user.email.toString() }, process.env.TOKEN_SECRET);
    const userRepository = typeorm_1.getRepository(User_1.User);
    try {
        const checkEmail = yield userRepository.findOne({ email });
        if (checkEmail) {
            return res.status(409).send({ message: "email already exists" });
        }
        const checkNickname = yield userRepository.findOne({ nickname });
        if (checkNickname) {
            return res.status(409).send({ message: "nickname already exists" });
        }
        yield userRepository.save(user);
        delete user.password;
    }
    catch (error) {
        return res.status(500).send(error);
    }
    res.status(201).send({ user, token });
});
UserController.userLogin = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password } = req.body;
    if (!email || !password) {
        res.status(400).send({ message: "email and password can't be blank" });
    }
    const userRepository = typeorm_1.getRepository(User_1.User);
    let user;
    try {
        user = yield userRepository.findOneOrFail({ where: { email } });
    }
    catch (error) {
        res.status(401).send({ message: "unauthorized" });
    }
    if (!user.checkPassword(password)) {
        res.status(401).send({ message: "unauthorized" });
        return;
    }
    const token = jwt.sign({ user: user.email.toString() }, process.env.TOKEN_SECRET, { expiresIn: "1d" });
    delete user.password;
    res.send({ user, token });
});
exports.default = UserController;
//# sourceMappingURL=UserController.js.map