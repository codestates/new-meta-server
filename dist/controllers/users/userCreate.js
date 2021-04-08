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
exports.userCreate = void 0;
const typeorm_1 = require("typeorm");
const User_1 = require("../../entity/User");
const jsonwebtoken_1 = require("jsonwebtoken");
function userCreate(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const userRepository = typeorm_1.getManager().getRepository(User_1.User);
        const newUser = userRepository.create(req.body);
        yield userRepository.save(newUser);
        const token = jsonwebtoken_1.jwt.sign(newUser, "secret");
        res.status(201).send({ user: newUser, token });
    });
}
exports.userCreate = userCreate;
//# sourceMappingURL=userCreate.js.map