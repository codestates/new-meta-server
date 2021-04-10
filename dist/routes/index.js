"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const user_1 = require("./user");
const summoner_1 = require("./summoner");
const static_1 = require("./static");
const routes = express_1.Router();
routes.use("/users", user_1.default);
routes.use("/summoners", summoner_1.default);
routes.use("/statics", static_1.default);
exports.default = routes;
//# sourceMappingURL=index.js.map