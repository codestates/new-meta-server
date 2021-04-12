"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const SummonerController_1 = require("../controllers/SummonerController");
const router = express_1.Router();
/* 소환사 기본 정보(검색에 필요한 암호화된 아이디) */
router.post("/summonerinfo", SummonerController_1.default.summonerInfo);
/* 소환사 랭크 게임 티어 및 승률 정보 */
router.post("/leagueinfo", SummonerController_1.default.summonerLeagueInfo);
// /* 소환사 랭크 게임 매치 리스트 */
router.post("/recentmatchlist", SummonerController_1.default.summonerMatchList);
router.post("/laneinfo", SummonerController_1.default.summonerLaneInfo);
router.post("/recentchampions", SummonerController_1.default.summonerRecentChampions);
/* 소환사의 최근 랭크 게임 20경기의 매치 타임라인 데이터 */
router.post("/eventtimeline", SummonerController_1.default.eventTimeline);
router.post("/exptimeline", SummonerController_1.default.expTimeline);
exports.default = router;
//# sourceMappingURL=summoner.js.map