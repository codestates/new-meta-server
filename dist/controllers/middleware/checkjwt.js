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
exports.checkJwt = void 0;
const typeorm_1 = require("typeorm");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
dotenv.config();
const User_1 = require("../../entity/User");
const checkJwt = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const token = req.headers.authorization.split(" ")[1];
        const decoded = jwt.verify(token, process.env.TOKEN_SECRET);
        const userRepository = typeorm_1.getRepository(User_1.User);
        const user = yield userRepository.findOne({
            email: decoded.email,
        });
        if (!user) {
            throw new Error();
        }
        console.log("middleware 통과");
        next();
    }
    catch (error) {
        res.status(401).send({ error: "Please authenticate." });
    }
});
exports.checkJwt = checkJwt;
//# sourceMappingURL=checkjwt.js.map