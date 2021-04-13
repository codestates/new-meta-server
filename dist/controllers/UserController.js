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
const bcrypt = require("bcryptjs");
const dotenv = require("dotenv");
dotenv.config();
class UserController {
}
UserController.userCreate = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { nickname, email, password } = req.body;
    // 빈 요청값이 없는지 확인
    if (!nickname || !email || !password) {
        return res
            .status(400)
            .send({ message: "Nickname, email and password can't be blank" });
    }
    // 닉네임 중복검사
    const checkNickname = yield typeorm_1.getRepository(User_1.User)
        .createQueryBuilder()
        .where({ nickname })
        .getOne();
    if (checkNickname) {
        return res.status(409).send({ message: "Nickname already exists" });
    }
    // 이메일 중복검사
    const checkEmail = yield typeorm_1.getRepository(User_1.User)
        .createQueryBuilder()
        .where({ email })
        .getOne();
    if (checkEmail) {
        return res.status(409).send({ message: "Email already exists" });
    }
    // DB에 넣을 값
    let user = new User_1.User();
    user.nickname = nickname;
    user.email = email;
    user.password = password;
    user.hashPassword();
    // INSERT 쿼리
    const queryExecution = yield typeorm_1.getRepository(User_1.User)
        .createQueryBuilder()
        .insert()
        .into(User_1.User)
        .values(user)
        .execute();
    delete user.password;
    res.status(201).send({ user, message: "Account created successfully" });
});
UserController.userLogin = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password } = req.body;
    // 빈 요청값이 있는지 확인
    if (!email || !password) {
        return res
            .status(400)
            .send({ message: "Email and password can't be blank" });
    }
    // DB에서 해당 유저 정보 찾기
    const user = yield typeorm_1.getRepository(User_1.User)
        .createQueryBuilder()
        .where({ email })
        .getOne();
    // 이메일에 해당하는 유저 있는지 확인
    if (!user) {
        return res.status(401).send({ message: "Check your email or password" });
    }
    // 비밀번호 맞는지 확인
    if (!user.checkPassword(password)) {
        return res.status(401).send({ message: "Check your email or password" });
    }
    // 토큰 발급
    const token = jwt.sign({
        id: user.id.toString(),
        email: user.email.toString(),
        nickname: user.nickname.toString(),
    }, process.env.TOKEN_SECRET, {
        expiresIn: "15 days",
    });
    delete user.password;
    res.send({ user, token, message: "Logged in successfully" });
});
UserController.userLogout = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // 토큰이 없는 경우
    if (!req.headers.authorization) {
        return res.status(400).send({ message: "Please login again" });
    }
    // 토큰 확인 된 경우
    const token = req.headers.authorization.split(" ")[1];
    try {
        const decoded = jwt.verify(token, process.env.TOKEN_SECRET);
        const user = yield typeorm_1.getRepository(User_1.User)
            .createQueryBuilder()
            .where({ email: decoded.email })
            .getOne();
        // 새 토큰 발급
        const newToken = jwt.sign({ email: user.email.toString() }, process.env.TOKEN_SECRET, { expiresIn: "1s" });
        delete user.password;
        return res.send({ user, newToken, message: "Logged out successfully" });
    }
    catch (error) {
        // 토큰이 다른 경우
        return res.status(401).send({ message: "Invalid token" });
    }
});
UserController.userReadProfile = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // 토큰이 없는 경우
    if (!req.headers.authorization) {
        return res.status(400).send({ message: "Please login again" });
    }
    // 토큰 확인 된 경우
    const token = req.headers.authorization.split(" ")[1];
    try {
        const decoded = jwt.verify(token, process.env.TOKEN_SECRET);
        const user = yield typeorm_1.getRepository(User_1.User)
            .createQueryBuilder()
            .where({ email: decoded.email })
            .getOne();
        delete user.password;
        res.send({ user, message: "Ok" });
    }
    catch (error) {
        // 토큰이 다른 경우
        return res.status(401).send({ message: "Invalid token" });
    }
});
UserController.userPasswordUpdate = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, currentPassword, newPassword } = req.body;
    // 공란 있는지 확인
    if (!currentPassword || !newPassword) {
        return res.status(400).send({
            message: "Please enter both your current password and the new one",
        });
    }
    // 현 비밀번호 제대로 입력했는지 확인
    const passwordMatch = yield typeorm_1.getRepository(User_1.User)
        .createQueryBuilder()
        .where({ email })
        .getOne();
    if (!passwordMatch.checkPassword(currentPassword)) {
        return res
            .status(401)
            .send({ message: "Please check your current password" });
    }
    // 토큰이 없는 경우
    if (!req.headers.authorization) {
        return res.status(400).send({ message: "Please login again" });
    }
    // 토큰 확인
    const token = req.headers.authorization.split(" ")[1];
    try {
        const decoded = jwt.verify(token, process.env.TOKEN_SECRET);
        const hashedNewPassword = bcrypt.hashSync(newPassword, 8);
        const user = yield typeorm_1.getRepository(User_1.User)
            .createQueryBuilder()
            .update(User_1.User)
            .set({ password: hashedNewPassword })
            .where({ email: decoded.email })
            .execute();
        const result = yield typeorm_1.getRepository(User_1.User)
            .createQueryBuilder()
            .where({ email })
            .getOne();
        delete result.password;
        res.send({ user: result, message: "Password changed successfully" });
    }
    catch (error) {
        // 토큰이 다른 경우
        return res.status(401).send({ message: "Invalid token" });
    }
});
UserController.userDelete = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password } = req.body;
    // 토큰이 없는 경우
    if (!req.headers.authorization) {
        res.status(400).send({ message: "Please login again" });
    }
    // 현 비밀번호 제대로 입력했는지 확인
    const user = yield typeorm_1.getRepository(User_1.User)
        .createQueryBuilder()
        .where({ email })
        .getOne();
    if (!user.checkPassword(password)) {
        return res
            .status(401)
            .send({ message: "Please check your current password" });
    }
    // 토큰 확인
    const token = req.headers.authorization.split(" ")[1];
    try {
        const decoded = jwt.verify(token, process.env.TOKEN_SECRET);
        const user = yield typeorm_1.getRepository(User_1.User)
            .createQueryBuilder()
            .delete()
            .where({ email: decoded.email })
            .execute();
        res.send({ message: "Account deleted successfully" });
    }
    catch (error) {
        // 토큰이 다른 경우
        return res.status(401).send({ message: "Invalid token" });
    }
});
exports.default = UserController;
//# sourceMappingURL=UserController.js.map