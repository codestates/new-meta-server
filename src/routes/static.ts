import { Router } from "express";
import StaticController = require("../controllers/StaticController");
const router = Router();

/* 챔피언, 아이템, 룬, 소환사주문 */
router.get("/championinfo", StaticController.ChampionInfo);

router.get("/iteminfo", StaticController.ItemInfo);

// router.get("/spellInfo", StaticController.spellInfo);

export default router;
