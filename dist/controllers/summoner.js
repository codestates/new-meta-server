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
const axios = require("axios");
const dotenv = require("dotenv");
dotenv.config();
const API_KEY = process.env.API_KEY;
/* API Data */
/* 클라이언트에서 사용자 소환사명과 포지션을 request로 받은 경우 */
module.exports = {
    summonerInfo: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        console.log(req.body);
        const summonerName = encodeURI(req.body.summonerName);
        return axios
            .get(`https://kr.api.riotgames.com/lol/summoner/v4/summoners/by-name/${summonerName}?api_key=${API_KEY}`)
            .then((response) => {
            res.status(200).json({
                id: response.data.id,
                accountId: response.data.accountId,
                puuid: response.data.puuid,
                name: response.data.name,
            });
        })
            .catch((err) => res.status(404).send("Summoner Not Found"));
    }),
    summonerLeagueInfo: (req, res) => {
        const encryptedSummonerId = req.body.id;
        return axios
            .get(`https://kr.api.riotgames.com/lol/league/v4/entries/by-summoner/${encryptedSummonerId}?api_key=${API_KEY}`)
            .then((response) => {
            console.log(response.data);
            if (!response.data[0] ||
                response.data[0].wins + response.data[0].losses < 20) {
                res.status(400).send("Not enough Data to analyze");
            }
            else {
                res.status(200).json(response.data);
            }
        });
    },
    summonerLaneInfo: (req, res) => {
        const encryptedAccountId = req.body.accountId;
        return axios
            .get(`https://kr.api.riotgames.com/lol/match/v4/matchlists/by-account/${encryptedAccountId}?queue=420&endIndex=100&api_key=${API_KEY}`)
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
            res.status(200).json(laneCount);
        });
    },
    /* 최근 플레이한 챔피언의  */
    summonerMatchList: (req, res) => {
        const encryptedAccountId = req.body.accountId;
        axios
            .get(`https://kr.api.riotgames.com/lol/match/v4/matchlists/by-account/${encryptedAccountId}?queue=420&api_key=${API_KEY}`)
            .then((response) => {
            res.json(response.data);
        });
    },
    summonerRecentChampions: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        /* getMatches로  */
        try {
            const accountId = req.body.accountId;
            const summonerName = req.body.name;
            const enCodedSummonerName = encodeURI(summonerName);
            const getChampionStats = ({ gameId, champion }) => __awaiter(void 0, void 0, void 0, function* () {
                const summonerPlayInfo = yield axios
                    .get(`https://kr.api.riotgames.com/lol/match/v4/matches/${gameId}?api_key=${API_KEY}`)
                    .then((response) => response.data)
                    .then((matchInfo) => matchInfo.participants)
                    .then((matchPlayerInfo) => matchPlayerInfo.filter((player) => {
                    return player.championId === champion;
                }));
                let result = {
                    gameId: gameId,
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
                return result;
            });
            const getMatchIDChampion = yield axios
                .get(`https://kr.api.riotgames.com/lol/match/v4/matchlists/by-account/${accountId}?endIndex=10&api_key=${API_KEY}&summonerName=${enCodedSummonerName}`)
                .then((response) => response.data.matches)
                .then((matches) => {
                let matchList = [];
                matches.map((match) => {
                    matchList.push({ gameId: match.gameId, champion: match.champion });
                });
                return matchList;
            })
                .then((matchList) => __awaiter(void 0, void 0, void 0, function* () {
                // console.log("matchList", matchList);
                let resultArray = [];
                const callback = () => __awaiter(void 0, void 0, void 0, function* () {
                    for (let el of matchList) {
                        yield getChampionStats(el).then((result) => resultArray.push(result));
                    }
                    return resultArray;
                });
                return callback();
            }));
            res.status(200).json(getMatchIDChampion);
        }
        catch (err) {
            console.log(err);
        }
    }),
    /* 15분까지의 타임라인 데이터  */
    matchTimeline: (req, res) => {
        const gameId = req.body.gameId;
        axios
            .get(`https://kr.api.riotgames.com/lol/match/v4/timelines/by-match/${gameId}?api_key=${API_KEY}`)
            .then((response) => {
            res.send(response.data.frames);
        });
    },
};
//# sourceMappingURL=summoner.js.map