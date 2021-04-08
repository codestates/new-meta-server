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
// require
require("reflect-metadata");
const typeorm_1 = require("typeorm");
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const morgan = require("morgan");
const routes_1 = require("./routes");
// TypeORM 구동
typeorm_1.createConnection()
    .then((connection) => __awaiter(void 0, void 0, void 0, function* () {
    console.log("Database connected...");
    // 기본 설정
    const app = express();
    app.use(bodyParser.json());
    app.use(morgan("dev"));
    app.use(cors({
        origin: true,
        credentials: true,
        methods: ["GET", "POST", "OPTIONS", "PATCH", "DELETE"],
    }));
    // 라우트
    app.use("/", routes_1.default);
    // 서버 구동
    const PORT = 4000;
    app.listen(PORT, () => {
        console.log(`Express application is up and running on port ${PORT}`);
    });
}))
    .catch((err) => console.log(err));
//# sourceMappingURL=app.js.map