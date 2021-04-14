import { Router } from "express";
import SummonerController from "../controllers/SummonerController";

const router = Router();

/* 소환사 기본 정보(검색에 필요한 암호화된 아이디) */
router.post("/summonerinfo", SummonerController.summonerInfo);

export default router;
