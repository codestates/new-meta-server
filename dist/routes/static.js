"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const StaticController = require("../controllers/StaticController");
const router = express_1.Router();
/* 챔피언, 아이템, 룬, 소환사주문 */
router.get("/championinfo", StaticController.ChampionInfo);
router.get("/iteminfo", StaticController.ItemInfo);
// router.get("/spellInfo", StaticController.spellInfo);
exports.default = router;
//# sourceMappingURL=static.js.map