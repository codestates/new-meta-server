import { Request, Response } from "express";
import * as dotenv from "dotenv";
import axios from "axios";
import { register } from "tsconfig-paths";
import { resolve } from "url";
dotenv.config();
const API_KEY = process.env.API_KEY;

/* API Data */
/* 클라이언트에서 사용자 소환사명과 포지션을 request로 받은 경우 */
class SummonerController {
  static summonerInfo = (req: Request, res: Response) => {
    const summonerName = encodeURI(req.body.summonerName);
    return axios
      .get(
        `https://kr.api.riotgames.com/lol/summoner/v4/summoners/by-name/${summonerName}?api_key=${API_KEY}`
      )
      .then((response) => {
        res.status(200).json({
          id: response.data.id,
          accountId: response.data.accountId,
          puuid: response.data.puuid,
          name: response.data.name,
        });
      })
      .catch((err) => res.status(404).send("Summoner Not Found"));
  };

  static summonerLeagueInfo = (req: Request, res: Response) => {
    const encryptedSummonerId = req.body.id;
    return axios
      .get(
        `https://kr.api.riotgames.com/lol/league/v4/entries/by-summoner/${encryptedSummonerId}?api_key=${API_KEY}`
      )
      .then((response) => {
        if (
          !response.data[0] ||
          response.data[0].wins + response.data[0].losses < 20
        ) {
          res.status(400).send("Not enough Data to analyze");
        } else {
          res.status(200).json(response.data);
        }
      });
  };

  static summonerLaneInfo = (req: Request, res: Response) => {
    const encryptedAccountId = req.body.accountId;
    return axios
      .get(
        `https://kr.api.riotgames.com/lol/match/v4/matchlists/by-account/${encryptedAccountId}?queue=420&api_key=${API_KEY}`
      )
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
          } else if (matchList[i].lane === "JUNGLE") {
            laneCount.JUNGLE += 1;
          } else if (matchList[i].lane === "MID") {
            laneCount.MID += 1;
          } else if (matchList[i].lane === "BOTTOM") {
            laneCount.AD_CARRY += 1;
          } else if (matchList[i].lane === "NONE") {
            laneCount.SUPPORT += 1;
          }
        }
        res.status(200).json(laneCount);
      });
  };

  /* 최근 플레이한 랭크게임 20경기 데이터 가져오기 */
  static summonerMatchList = async (req: Request, res: Response) => {
    const encryptedAccountId = req.body.accountId;
    axios
      .get(
        `https://kr.api.riotgames.com/lol/match/v4/matchlists/by-account/${encryptedAccountId}?queue=420&endIndex=20&api_key=${API_KEY}`
      )
      .then((response) => res.send(response.data.matches));
  };

  /* 최근 플레이한 랭크 게임 20경기에서 플레이한 챔피언 및 포지션, KDA 가져오기 */
  static summonerRecentChampions = async (req: Request, res: Response) => {
    interface MatchInfo {
      platformId: string;
      gameId: number;
      champion: number;
      queue: number;
      season: number;
      timestamp: number;
      role: string;
      lane: string;
    }

    interface PlayerInfo {
      gameId: number;
      championId: number;
      stats: {
        participantId: number;
        win: boolean;
        kills: number;
        deaths: number;
        assists: number;
      };
      timeline: {
        lane: string;
      };
    }
    try {
      const matchListArray: MatchInfo[] = req.body;
      const summonerName = req.body.name;
      const enCodedSummonerName = encodeURI(summonerName);
      let matchList = [];
      let resultArray = [];

      const getChampionStats = (matchInfo: MatchInfo, result) => {
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

      Promise.all(
        matchListArray.map((el: MatchInfo) => {
          return axios.get(
            `https://kr.api.riotgames.com/lol/match/v4/matches/${el.gameId}?api_key=${API_KEY}`
          );
        })
      ).then((result) => {
        for (let i = 0; i < matchListArray.length; i++) {
          resultArray.push(getChampionStats(matchListArray[i], result[i]));
        }
        res.status(200).send(resultArray);
      });
    } catch (err) {
      console.log(err);
    }
  };

  /* *
   * 15분까지의 타임라인 데이터
   *  req.body의 summonerParticipantId 를 기준으로
   * participantFrames에서 participantId:summonerParticipantId인 객체 map
   * events 배열에서는 type이  "CHAMPION_KILL",  "ELITE_MONSTER_KILL" 인 객체만 map
   */

  static eventTimeline = (req: Request, res: Response) => {
    interface FrameData {
      timestamp: number;
      participants: object;
      events: Array<object>;
    }

    interface EventData {
      type: string;
      timestamp: number;
      monsterType?: string;
      killerId?: number;
      victimId?: number;
      assistingParticipantIds?: Array<number>;
    }

    interface matchInfo {
      gameId: number;
      champion: number;
      stats: { participantId: number };
    }

    try {
      const matchListArray: matchInfo[] = req.body;
      let eventDataArray = [];
      const getMatchTimeline = async (el: matchInfo) => {
        const gameId = el.gameId;
        const summonerParticipantId = el.stats.participantId;

        const variable = await axios
          .get(
            `https://kr.api.riotgames.com/lol/match/v4/timelines/by-match/${gameId}?api_key=${API_KEY}`
          )
          .then((response) => {
            const arr: FrameData[] = response.data.frames;
            return arr.filter((el) => {
              return el.timestamp !== 0 && el.timestamp < 910000;
            });
          })
          .then((output: FrameData[]) => {
            let eventTimeline = output.map((el) => {
              return el.events;
            });
            return eventTimeline;
          })
          .then((output: EventData[][]) => {
            let eventArray = [];
            for (let el of output) {
              for (let ele of el) {
                eventArray.push(ele);
              }
            }
            return eventArray;
          })
          .then((result: EventData[]) => {
            return result.filter((el) => {
              return (
                el.type === "CHAMPION_KILL" || el.type === "ELITE_MONSTER_KILL"
              );
            });
          })
          .then((result) => {
            const callback = () => {
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
              for (let el of result) {
                if (el.type === "CHAMPION_KILL") {
                  if (el.killerId === summonerParticipantId) {
                    if (el.timestamp > 140000 && el.timestamp < 170000) {
                      summonerEventInfo.matchKillForLevel2 += 1;
                      summonerEventInfo.matchKills += 1;
                    } else if (el.timestamp > 200000 && el.timestamp < 240000) {
                      summonerEventInfo.matchKillForLevel3 += 1;
                      summonerEventInfo.matchKills += 1;
                    } else {
                      summonerEventInfo.matchKills += 1;
                    }
                  } else if (el.victimId === summonerParticipantId) {
                    if (el.timestamp > 140000 && el.timestamp < 170000) {
                      summonerEventInfo.matchDeathForLevel2 += 1;
                      summonerEventInfo.matchDeaths += 1;
                    } else if (el.timestamp > 200000 && el.timestamp < 240000) {
                      summonerEventInfo.matchDeathForLevel3 += 1;
                      summonerEventInfo.matchDeaths += 1;
                    } else {
                      summonerEventInfo.matchDeaths += 1;
                    }
                  } else if (
                    el.assistingParticipantIds.includes(summonerParticipantId)
                  ) {
                    if (el.timestamp > 200000 && el.timestamp < 240000) {
                      summonerEventInfo.matchAssistForLevel3 += 1;
                      summonerEventInfo.matchAssists += 1;
                    } else {
                      summonerEventInfo.matchAssists += 1;
                    }
                  }
                } else if (el.type === "ELITE_MONSTER_KILL") {
                  if (el.killerId === summonerParticipantId) {
                    if (el.monsterType === "DRAGON") {
                      summonerEventInfo.matchDragonKills += 1;
                    } else if (el.monsterType === "RIFTHERALD") {
                      summonerEventInfo.matchHeraldKills += 1;
                    }
                  }
                }
              }
              return summonerEventInfo;
            };
            const temp = callback();
            return temp;
          });
        eventDataArray.push(variable);
      };

      const callback = (array: matchInfo[]) => {
        for (let el of array) {
          getMatchTimeline(el);
          // eventDataArray.push(result);
        }
        setTimeout(() => {
          res.status(200).send(eventDataArray);
        }, 1500);
      };
      callback(matchListArray);
    } catch (err) {
      console.log(err);
      res.status(404).send("nope");
    }
  };

  static expTimeline = async (req: Request, res: Response) => {
    interface MatchInfo {
      gameId: number;
      champion: number;
      stats: { participantId: number };
    }
    interface FrameData {
      timestamp: number;
      participants: object;
      events: Array<object>;
    }

    interface FrameExpData {
      timestamp: number;
      participantFrames: ParticipantFrames;
    }

    interface ParticipantFrames {
      participantId: number;
      position: object;
      currentGold: number;
      totalGold: number;
      level: number;
      xp: number;
      minionsKilled: number;
      jungleMinionsKilled: number;
      dominionScore: number;
      teamScore: number;
    }

    interface AverageExpData {
      timestamp: number;
      currentGold: number;
      totalGold: number;
      jungleMinionsKilled: number;
      minionsKilled: number;
    }

    try {
      let expDataArray = [];
      const matchListArray: MatchInfo[] = req.body;
      const getMatchExp = (matchInfo: MatchInfo, result) => {
        const summonerParticipantId = matchInfo.stats.participantId;
        let summonerExpData: FrameExpData[] = [];
        function temp(response) {
          let result = response.data.frames.filter((el: FrameData) => {
            return el.timestamp > 0 && el.timestamp < 910000;
          });
          let FrameDataArray: FrameExpData[] = [];
          for (let el of result) {
            FrameDataArray.push({
              participantFrames: el.participantFrames,
              timestamp: el.timestamp,
            });
            for (let i = 0; i < FrameDataArray.length; i++) {
              for (let j = 1; j < 11; j++) {
                if (
                  FrameDataArray[i].participantFrames[String(j)]
                    .participantId === summonerParticipantId
                ) {
                  summonerExpData.push({
                    timestamp: FrameDataArray[i].timestamp,
                    participantFrames:
                      FrameDataArray[i].participantFrames[String(j)],
                  });
                }
              }
            }
            FrameDataArray = [];
          }
        }
        temp(result);
        return summonerExpData;
        /* 코드 실행순서 : getMatchExp => 20경기의 구간별 totalGod, minionsKilled, jungleMinionsKilled, 합산 => 평균 내기 */
      };

      Promise.all(
        matchListArray.map((el: MatchInfo) => {
          return axios.get(
            `https://kr.api.riotgames.com/lol/match/v4/timelines/by-match/${el.gameId}?api_key=${API_KEY}`
          );
        })
      )
        .then((result) => {
          for (let i = 0; i < matchListArray.length; i++) {
            expDataArray.push(getMatchExp(matchListArray[i], result[i]));
          }
          return expDataArray;
        })
        .then((expDataArray) => {
          res.send(getAverageExp(expDataArray));
        });

      function getAverageExp(array: FrameExpData[][]) {
        let result: AverageExpData[] = [];
        for (let i = 0; i < array.length; i++) {
          for (let j = 0; j < array[i].length; j++) {
            if (result[j]) {
              result[j].timestamp = 60000 * (j + 1);
              result[j].currentGold +=
                array[i][j].participantFrames.currentGold / 20;
              result[j].totalGold +=
                array[i][j].participantFrames.totalGold / 20;
              result[j].minionsKilled +=
                array[i][j].participantFrames.minionsKilled / 20;
              result[j].jungleMinionsKilled +=
                array[i][j].participantFrames.jungleMinionsKilled / 20;
            } else {
              result[j] = {
                timestamp: 60000 * (j + 1),
                currentGold: array[0][0].participantFrames.currentGold,
                totalGold: array[0][0].participantFrames.totalGold,
                minionsKilled: array[0][0].participantFrames.minionsKilled,
                jungleMinionsKilled:
                  array[0][0].participantFrames.jungleMinionsKilled,
              };
            }
          }
        }
        return result;
      }
    } catch (err) {
      console.log(err);
    }
  };
}

export default SummonerController;
