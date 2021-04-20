import { Request, Response } from "express";
import * as dotenv from "dotenv";
import axios from "axios";


dotenv.config();
const API_KEY = process.env.API_KEY;

/* API Data */
/* 클라이언트에서 사용자 소환사명을 request로 받은 경우 */
class SummonerController {
  static summonerInfo = (req: Request, res: Response) => {
    interface SummonerAllData {
      summonerInfo: {
        id: string;
        accountId: string;
        name: string;
      };
      leagueInfo?: {};
      laneInfo?: {};
      recentMatches: [];
      recentChampionStats: PlayerMatchInfo[];
      kdaTimelineData: KDAEventData[];
      expTimelineData: FrameExpData[][];
    }

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

    interface PlayerMatchInfo {
      gameId: number;
      champion: number;
      stats: {
        participantId: number;
        win: boolean;
        kills: number;
        deaths: number;
        assists: number;
      };
    }
    interface FrameData {
      timestamp: number;
      participants: object;
      events: Array<EventData>;
    }

    interface EventData {
      type: string;
      timestamp: number;
      monsterType?: string;
      killerId?: number;
      victimId?: number;
      assistingParticipantIds: Array<number>;
    }

    interface KDAEventData {
      matchKills: number;
      matchAssists: number;
      matchDeaths: number;
      matchDragonKills: number;
      matchHeraldKills: number;
      matchKillForLevel3: number;
      matchAssistForLevel3: number;
      matchDeathForLevel3: number;
      matchKillForLevel2: number;
      matchAssistForLevel2: number;
      matchDeathForLevel2: number;
    }

    interface Position {
      x: number;
      y: number;
    }

    interface FrameExpData {
      timestamp: number;
      participantFrames: ParticipantFrames;
    }
    interface ParticipantFrames {
      [index: string]: any;
      participantId: number;
      position: Position;
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

    let summonerAllData: SummonerAllData = {
      summonerInfo: {
        id: "",
        accountId: "",
        name: "",
      },
      recentMatches: [],
      recentChampionStats: [],
      kdaTimelineData: [],
      expTimelineData: []
    };
  
    const summonerName =req.body.summonerName;
    let encryptedAccountId: string = "";
    let encryptedSummonerId: string = "";

    console.log(summonerName)

    return axios
      .get(
        `https://kr.api.riotgames.com/lol/summoner/v4/summoners/by-name/${summonerName}?api_key=${API_KEY}`
      )
      .then((response) => {
        summonerAllData.summonerInfo = response.data;
        // 티어 및 랭크게임 전적 보기

        encryptedSummonerId = summonerAllData.summonerInfo.id; // 잘 들어감
        return axios
          .get(
            `https://kr.api.riotgames.com/lol/league/v4/entries/by-summoner/${encryptedSummonerId}?api_key=${API_KEY}`
          )
          .then((response) => {
            // console.log("response : ", response);

            if (
              !response.data[0] ||
              response.data[0].wins + response.data[0].losses < 20
            ) {
              res.status(400).send("Not enough Data to analyze");
            } else {
              summonerAllData.leagueInfo = response.data[0];
            }
          })
          .then(() => {
            encryptedAccountId = summonerAllData.summonerInfo.accountId;
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
                summonerAllData.laneInfo = laneCount;
              });
          })
          .then(() => {
            /* 최근 플레이한 랭크게임 20경기 데이터 가져오기 */
            encryptedAccountId = summonerAllData.summonerInfo.accountId;
            return axios
              .get(
                `https://kr.api.riotgames.com/lol/match/v4/matchlists/by-account/${encryptedAccountId}?queue=420&endIndex=20&api_key=${API_KEY}`
              )
              .then((response) => {
                summonerAllData.recentMatches = response.data.matches;
              });
          })
          .then(async () => {
            const matchListArray = summonerAllData.recentMatches;

            summonerAllData.recentChampionStats = [];
            summonerAllData.kdaTimelineData = [];
            summonerAllData.expTimelineData = [];

            const getChampionStats = (
              matchInfo: MatchInfo,
              result: any
            ): PlayerMatchInfo => {
              let summonerPlayInfo = result.data.participants.filter(
                (player: { championId: number }) => {
                  return player.championId === matchInfo.champion;
                }
              );
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

            await setTimeout(() => {}, 2000);
            const recentMatchData = await Promise.all(
              matchListArray.map((el: MatchInfo) => {
                return axios.get(
                  `https://kr.api.riotgames.com/lol/match/v4/matches/${el.gameId}?api_key=${API_KEY}`
                );
              })
            ); // 20ㄱㅐ 요청
            for (let i = 0; i < matchListArray.length; i++) {
              summonerAllData.recentChampionStats.push(
                getChampionStats(matchListArray[i], recentMatchData[i])
              );
            }
            const getKDATimeline = (el: PlayerMatchInfo, result: any) => {
              const summonerParticipantId = el.stats.participantId;
              let arr: FrameData[] = result.data.frames;
              let linePhaseData: FrameData[] = arr.filter((el) => {
                return el.timestamp > 0 && el.timestamp < 910000;
              });

              let eventTimeline: EventData[][] = linePhaseData.map((el) => {
                return el.events;
              });

              let eventArray: EventData[] = [];

              for (let el of eventTimeline) {
                for (let ele of el) {
                  eventArray.push(ele);
                }
              }
              let kdaEventArray = eventArray.filter((el: EventData) => {
                return (
                  el.type === "CHAMPION_KILL" ||
                  el.type === "ELITE_MONSTER_KILL"
                );
              });
              const callback = (array: EventData[]) => {
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
                      } else if (
                        el.timestamp > 200000 &&
                        el.timestamp < 240000
                      ) {
                        summonerEventInfo.matchKillForLevel3 += 1;
                        summonerEventInfo.matchKills += 1;
                      } else {
                        summonerEventInfo.matchKills += 1;
                      }
                    } else if (el.victimId === summonerParticipantId) {
                      if (el.timestamp > 140000 && el.timestamp < 170000) {
                        summonerEventInfo.matchDeathForLevel2 += 1;
                        summonerEventInfo.matchDeaths += 1;
                      } else if (
                        el.timestamp > 200000 &&
                        el.timestamp < 240000
                      ) {
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
              return callback(kdaEventArray);
            };

            /* function getAverageExp(array: FrameExpData[][]) {
              let result: AverageExpData[] = [];

              for (let i = 0; i < array.length; i++) {
                for (let j = 0; j < array[i].length; j++) {
                  if (result[j]) {
                    result[j].timestamp = 60000 * (j + 1);
                    result[j].currentGold += Math.round(
                      array[i][j].participantFrames.currentGold / 20
                    );
                    result[j].totalGold += Math.round(
                      array[i][j].participantFrames.totalGold / 20
                    );
                    result[j].minionsKilled += Math.round(
                      array[i][j].participantFrames.minionsKilled / 20
                    );
                    result[j].jungleMinionsKilled += Math.round(
                      array[i][j].participantFrames.jungleMinionsKilled / 20
                    );
                  } else {
                    result[j] = {
                      timestamp: 60000 * (j + 1),
                      currentGold: array[0][0].participantFrames.currentGold,
                      totalGold: array[0][0].participantFrames.totalGold,
                      minionsKilled:
                        array[0][0].participantFrames.minionsKilled,
                      jungleMinionsKilled:
                        array[0][0].participantFrames.jungleMinionsKilled,
                    };
                  }
                }
              }
              return result;
            } */


            const getExpTimeline = (el: PlayerMatchInfo, result: any) => {
              const summonerParticipantId: number = el.stats.participantId;
              let summonerExpData: FrameExpData[] = [];

              let linePhaseData: FrameExpData[] = result.data.frames.filter(
                (el: FrameData) => {
                  return el.timestamp > 0 && el.timestamp < 910000;
                }
              ); 
              function temp(linePhaseData: FrameExpData[]) {
                let FrameDataArray: FrameExpData[] = [];
                for (let el of linePhaseData) {
                  FrameDataArray.push({
                    participantFrames: el.participantFrames,
                    timestamp: el.timestamp,
                  });
                  for (let i = 0; i < FrameDataArray.length; i++) {
                    for (let j = 1; j < 11; j++) {
                      if (
                        FrameDataArray[i].participantFrames[j.toString()]
                          .participantId === summonerParticipantId
                      ) {
                        summonerExpData.push({
                          timestamp: FrameDataArray[i].timestamp,
                          participantFrames:
                            FrameDataArray[i].participantFrames[j.toString()],
                        });
                      }
                    }
                  }
                  FrameDataArray = [];
                }
                return summonerExpData;
              }
              temp(linePhaseData);
              return summonerExpData;


            };

            /* 코드 실행순서 : getMatchExp => 20경기의 구간별 totalGod, minionsKilled, jungleMinionsKilled, 합산 => 평균 내기 */

            function getTimelineData() {
              Promise.all(
                summonerAllData.recentChampionStats.map(
                  (el: PlayerMatchInfo) => {
                    return axios.get(
                      `https://kr.api.riotgames.com/lol/match/v4/timelines/by-match/${el.gameId}?api_key=${API_KEY}`
                    );
                  }
                )
              )
                .then((result) => {
                  for (
                    let i = 0;
                    i < summonerAllData.recentChampionStats.length;
                    i++
                  ) {
                    summonerAllData.kdaTimelineData.push(
                      getKDATimeline(
                        summonerAllData.recentChampionStats[i],
                        result[i]
                      )
                    );
                    let expData: FrameExpData[][] = [];
                    if (getExpTimeline(
                      summonerAllData.recentChampionStats[i],
                      result[i]
                    ).length === 15) {
                      summonerAllData.expTimelineData?.push(getExpTimeline(
                      summonerAllData.recentChampionStats[i],
                      result[i]
                    ))
                    }
                  }
                  res.status(200).send(summonerAllData);
                })
                .catch((err) => res.send(err));
            }

            await setTimeout(() => {
              getTimelineData();
            }, 3000);
          })
          .catch((err) => res.send(err));
      })
      .catch((err) => {
        res.send(err);
      });
  };
}

export default SummonerController;
