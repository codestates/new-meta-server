const express = require("express");
const router = express.Router();
const controller = require("../controllers/static");

/* 챔피언, 아이템, 룬, 소환사주문 */
router.get("/championInfo", controller.ChampionInfo);

router.get("/itemInfo", controller.ItemInfo);

router.get("/perkInfo", controller.perkInfo);

router.get("/spellInfo", controller.spellInfo);

module.exports = router;
