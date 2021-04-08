"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const user_1 = require("./user");
const routes = express_1.Router();
routes.use("/users", user_1.default);
exports.default = routes;
//# sourceMappingURL=index.js.map