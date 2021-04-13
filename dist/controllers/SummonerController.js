"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv = require("dotenv");
const axios_1 = require("axios");
dotenv.config();
const API_KEY = process.env.API_KEY;
/* API Data */
/* 클라이언트에서 사용자 소환사명을 request로 받은 경우 */
class SummonerController {
}
SummonerController.summonerInfo = (req, res) => {
    let summonerAllData = {};
    const summonerName = encodeURI(req.body.summonerName);
    let encryptedAccountId = "";
    let encryptedSummonerId = "";
    return axios_1.default
        .get(`https://kr.api.riotgames.com/lol/summoner/v4/summoners/by-name/${summonerName}?api_key=${API_KEY}`)
        .then((response) => {
        summonerAllData.summonerInfo = response.data;
        return response.data;
    })
        .then(() => {
        // 티어 및 랭크게임 전적 보기
        encryptedSummonerId = summonerAllData.summonerInfo.id; // 잘 들어감
        return axios_1.default
            .get(`https://kr.api.riotgames.com/lol/league/v4/entries/by-summoner/${encryptedSummonerId}?api_key=${API_KEY}`)
            .then((response) => {
            if (!response.data[0] ||
                response.data[0].wins + response.data[0].losses < 20) {
                res.status(400).send("Not enough Data to analyze");
            }
            else {
                summonerAllData.leagueInfo = response.data[0];
            }
        })
            .then(() => {
            encryptedAccountId = summonerAllData.summonerInfo.accountId;
            return axios_1.default
                .get(`https://kr.api.riotgames.com/lol/match/v4/matchlists/by-account/${encryptedAccountId}?queue=420&api_key=${API_KEY}`)
                .then((response) => {
                const matchList = response.data.matches;
                let laneCount = {
                    TOP: 0,
                    JUNGLE: 0,
                    MID: 0,
                    AD_CARRY: 0,
                    SUPPORT: 0,
                };
                for (let i = 0; i < matchList.length; i++) {
                    if (matchList[i].lane === "TOP") {
                        laneCount.TOP += 1;
                    }
                    else if (matchList[i].lane === "JUNGLE") {
                        laneCount.JUNGLE += 1;
                    }
                    else if (matchList[i].lane === "MID") {
                        laneCount.MID += 1;
                    }
                    else if (matchList[i].lane === "BOTTOM") {
                        laneCount.AD_CARRY += 1;
                    }
                    else if (matchList[i].lane === "NONE") {
                        laneCount.SUPPORT += 1;
                    }
                }
                summonerAllData.laneInfo = laneCount;
            });
        })
            .then(() => {
            /* 최근 플레이한 랭크게임 20경기 데이터 가져오기 */
            encryptedAccountId = summonerAllData.summonerInfo.accountId;
            return axios_1.default
                .get(`https://kr.api.riotgames.com/lol/match/v4/matchlists/by-account/${encryptedAccountId}?queue=420&endIndex=20&api_key=${API_KEY}`)
                .then((response) => {
                summonerAllData.recentMatches = response.data.matches;
            });
        })
            .then(() => __awaiter(void 0, void 0, void 0, function* () {
            const matchListArray = summonerAllData.recentMatches;
            summonerAllData.recentChampionStats = [];
            summonerAllData.kdaTimelineData = [];
            summonerAllData.expTimelineData = [];
            const getChampionStats = (matchInfo, result) => {
                let summonerPlayInfo = result.data.participants.filter((player) => {
                    return player.championId === matchInfo.champion;
                });
                let summonerMatchStats = {
                    gameId: matchInfo.gameId,
                    champion: summonerPlayInfo[0].championId,
                    stats: {
                        participantId: summonerPlayInfo[0].stats.participantId,
                        win: summonerPlayInfo[0].stats.win,
                        kills: summonerPlayInfo[0].stats.kills,
                        deaths: summonerPlayInfo[0].stats.deaths,
                        assists: summonerPlayInfo[0].stats.assists,
                        lane: summonerPlayInfo[0].timeline.lane,
                    },
                };
                return summonerMatchStats;
            };
            yield setTimeout(() => { }, 2000);
            const recentMatchData = yield Promise.all(matchListArray.map((el) => {
                return axios_1.default.get(`https://kr.api.riotgames.com/lol/match/v4/matches/${el.gameId}?api_key=${API_KEY}`);
            })); // 20ㄱㅐ 요청
            for (let i = 0; i < matchListArray.length; i++) {
                summonerAllData.recentChampionStats.push(getChampionStats(matchListArray[i], recentMatchData[i]));
            }
            const getKDATimeline = (el, result) => {
                const gameId = el.gameId;
                const summonerParticipantId = el.stats.participantId;
                let arr = result.data.frames;
                let linePhaseData = arr.filter((el) => {
                    return el.timestamp > 0 && el.timestamp < 910000;
                });
                let eventTimeline = linePhaseData.map((el) => {
                    return el.events;
                });
                let eventArray = [];
                for (let el of eventTimeline) {
                    for (let ele of el) {
                        eventArray.push(ele);
                    }
                }
                let kdaEventArray = eventArray.filter((el) => {
                    return (el.type === "CHAMPION_KILL" ||
                        el.type === "ELITE_MONSTER_KILL");
                });
                const callback = (array) => {
                    let summonerEventInfo = {
                        matchKills: 0,
                        matchAssists: 0,
                        matchDeaths: 0,
                        matchDragonKills: 0,
                        matchHeraldKills: 0,
                        matchKillForLevel3: 0,
                        matchAssistForLevel3: 0,
                        matchDeathForLevel3: 0,
                        matchKillForLevel2: 0,
                        matchAssistForLevel2: 0,
                        matchDeathForLevel2: 0,
                    };
                    for (let el of array) {
                        if (el.type === "CHAMPION_KILL") {
                            if (el.killerId === summonerParticipantId) {
                                if (el.timestamp > 140000 && el.timestamp < 170000) {
                                    summonerEventInfo.matchKillForLevel2 += 1;
                                    summonerEventInfo.matchKills += 1;
                                }
                                else if (el.timestamp > 200000 &&
                                    el.timestamp < 240000) {
                                    summonerEventInfo.matchKillForLevel3 += 1;
                                    summonerEventInfo.matchKills += 1;
                                }
                                else {
                                    summonerEventInfo.matchKills += 1;
                                }
                            }
                            else if (el.victimId === summonerParticipantId) {
                                if (el.timestamp > 140000 && el.timestamp < 170000) {
                                    summonerEventInfo.matchDeathForLevel2 += 1;
                                    summonerEventInfo.matchDeaths += 1;
                                }
                                else if (el.timestamp > 200000 &&
                                    el.timestamp < 240000) {
                                    summonerEventInfo.matchDeathForLevel3 += 1;
                                    summonerEventInfo.matchDeaths += 1;
                                }
                                else {
                                    summonerEventInfo.matchDeaths += 1;
                                }
                            }
                            else if (el.assistingParticipantIds.includes(summonerParticipantId)) {
                                if (el.timestamp > 200000 && el.timestamp < 240000) {
                                    summonerEventInfo.matchAssistForLevel3 += 1;
                                    summonerEventInfo.matchAssists += 1;
                                }
                                else {
                                    summonerEventInfo.matchAssists += 1;
                                }
                            }
                        }
                        else if (el.type === "ELITE_MONSTER_KILL") {
                            if (el.killerId === summonerParticipantId) {
                                if (el.monsterType === "DRAGON") {
                                    summonerEventInfo.matchDragonKills += 1;
                                }
                                else if (el.monsterType === "RIFTHERALD") {
                                    summonerEventInfo.matchHeraldKills += 1;
                                }
                            }
                        }
                    }
                    return summonerEventInfo;
                };
                return callback(kdaEventArray);
            };
            const getExpTimeline = (el, result) => {
                const summonerParticipantId = el.stats.participantId;
                let summonerExpData = [];
                let linePhaseData = result.data.frames.filter((el) => {
                    return el.timestamp > 0 && el.timestamp < 910000;
                });
                let resultDataArray = [];
                function temp(linePhaseData) {
                    let FrameDataArray = [];
                    for (let el of linePhaseData) {
                        FrameDataArray.push({
                            participantFrames: el.participantFrames,
                            timestamp: el.timestamp,
                        });
                        for (let i = 0; i < FrameDataArray.length; i++) {
                            for (let j = 1; j < 11; j++) {
                                if (FrameDataArray[i].participantFrames[String(j)]
                                    .participantId === summonerParticipantId) {
                                    summonerExpData.push({
                                        timestamp: FrameDataArray[i].timestamp,
                                        participantFrames: FrameDataArray[i].participantFrames[String(j)],
                                    });
                                }
                            }
                        }
                        resultDataArray.push(summonerExpData);
                        FrameDataArray = [];
                    }
                    return resultDataArray;
                }
                temp(linePhaseData);
                function getAverageExp(array) {
                    let result = [];
                    for (let i = 0; i < array.length; i++) {
                        for (let j = 0; j < array[i].length; j++) {
                            if (result[j]) {
                                result[j].timestamp = 60000 * (j + 1);
                                result[j].currentGold += Math.round(array[i][j].participantFrames.currentGold / 20);
                                result[j].totalGold += Math.round(array[i][j].participantFrames.totalGold / 20);
                                result[j].minionsKilled += Math.round(array[i][j].participantFrames.minionsKilled / 20);
                                result[j].jungleMinionsKilled += Math.round(array[i][j].participantFrames.jungleMinionsKilled / 20);
                            }
                            else {
                                result[j] = {
                                    timestamp: 60000 * (j + 1),
                                    currentGold: array[0][0].participantFrames.currentGold,
                                    totalGold: array[0][0].participantFrames.totalGold,
                                    minionsKilled: array[0][0].participantFrames.minionsKilled,
                                    jungleMinionsKilled: array[0][0].participantFrames.jungleMinionsKilled,
                                };
                            }
                        }
                    }
                    return result;
                }
                return getAverageExp(resultDataArray);
            };
            /* 코드 실행순서 : getMatchExp => 20경기의 구간별 totalGod, minionsKilled, jungleMinionsKilled, 합산 => 평균 내기 */
            function getTimelineData() {
                Promise.all(summonerAllData.recentChampionStats.map((el) => {
                    return axios_1.default.get(`https://kr.api.riotgames.com/lol/match/v4/timelines/by-match/${el.gameId}?api_key=${API_KEY}`);
                }))
                    .then((result) => {
                    for (let i = 0; i < summonerAllData.recentChampionStats.length; i++) {
                        summonerAllData.kdaTimelineData.push(getKDATimeline(summonerAllData.recentChampionStats[i], result[i]));
                        summonerAllData.expTimelineData = getExpTimeline(summonerAllData.recentChampionStats[i], result[i]);
                    }
                    res.status(200).send(summonerAllData);
                })
                    .catch((err) => console.log(err));
            }
            yield setTimeout(() => {
                getTimelineData();
            }, 3000);
        }))
            .catch((err) => console.log(err));
    })
        .catch((err) => res.status(404).send("Summoner Not Found"));
};
exports.default = SummonerController;
//# sourceMappingURL=SummonerController.js.map