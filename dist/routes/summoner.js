const express = require("express");
const router = express.Router();
const controller = require("../controllers/summoner");
/* 소환사 기본 정보(검색에 필요한 암호화된 아이디) */
router.post("/summonerinfo", controller.summonerInfo);
/* 소환사 랭크 게임 티어 및 승률 정보 */
router.post("/leagueinfo", controller.summonerLeagueInfo);
// /* 소환사 랭크 게임 매치 리스트 */
router.post("/matchlist", controller.summonerMatchList);
router.post("/laneratio", controller.summonerLaneRatio);
/* 소환사 랭크 게임 20경기의 participantId 데이터 (타임라인을 확인하기 위한 필터값으로 필요함)*/
router.post("/recentchampions", controller.summonerRecentChampions);
// router.get("/matchPlayerId", controller.matchPlayerId);
/* 소환사의 최근 랭크 게임 20경기의 매치 타임라인 데이터 */
// router.get("/matchTimeline", controller.matchTimeline);
module.exports = router;
//# sourceMappingURL=summoner.js.map