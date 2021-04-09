import { Router } from "express";

import SummonerController from "../controllers/SummonerController";

const router = Router();

/* 소환사 기본 정보(검색에 필요한 암호화된 아이디) */
router.post("/summonerinfo", SummonerController.summonerInfo);
/* 소환사 랭크 게임 티어 및 승률 정보 */
router.post("/leagueinfo", SummonerController.summonerLeagueInfo);
// /* 소환사 랭크 게임 매치 리스트 */

router.post("/matchlist", SummonerController.summonerMatchList);

router.post("/laneinfo", SummonerController.summonerLaneInfo);

router.post("/recentchampions", SummonerController.summonerRecentChampions);

/* 소환사의 최근 랭크 게임 20경기의 매치 타임라인 데이터 */

router.post("/matchtimeline", SummonerController.matchTimeline);

export default router;
