const express = require("express");
const router = express.Router();
const controller = require("../controllers/summoner");

/* 소환사 기본 정보(검색에 필요한 암호화된 아이디) */
router.get("/summonerInfo", controller.summonerInfo);

/* 소환사 랭크 게임 티어 및 승률 정보 */
router.get("/leagueInfo", controller.summonerLeagueInfo);

/* 소환사 랭크 게임 매치 리스트 */

router.get("/matchList", controller.summonerMatchList);

router.post("/laneRatio", controller.summonerLaneRatio);

/* 소환사 랭크 게임 20경기의 participantId 데이터 (타임라인을 확인하기 위한 필터값으로 필요함)*/

// router.get("/matchPlayerId", controller.matchPlayerId);

/* 소환사의 최근 랭크 게임 20경기의 매치 타임라인 데이터 */

// router.get("/matchTimeline", controller.matchTimeline);

module.exports = router;
