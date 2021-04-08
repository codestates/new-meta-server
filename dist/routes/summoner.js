const express = require("express");
const router = express.Router();
const controller = require("../controllers/summoner");

/* 소환사 기본 정보(검색에 필요한 암호화된 아이디) */
router.post("/summonerinfo", controller.summonerInfo);
/* 소환사 랭크 게임 티어 및 승률 정보 */
router.post("/leagueinfo", controller.summonerLeagueInfo);
// /* 소환사 랭크 게임 매치 리스트 */

router.post("/matchlist", controller.summonerMatchList);

router.post("/laneinfo", controller.summonerLaneInfo);

router.post("/recentchampions", controller.summonerRecentChampions);

/* 소환사의 최근 랭크 게임 20경기의 매치 타임라인 데이터 */

router.get("/matchtimeline", controller.matchTimeline);

module.exports = router;