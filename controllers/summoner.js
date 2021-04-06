const express = require("express");
const axios = require("axios");
const dotenv = require("dotenv");
dotenv.config();
const API_KEY = process.env.API_KEY;

/* API Data */
/* 클라이언트에서 사용자 소환사명과 포지션을 request로 받은 경우 */
module.exports = {
  summonerInfo: async (req, res) => {
    const summonerId = await encodedURI(req.body.summonerName);
    return axios
      .get(
        `https://kr.api.riotgames.com/lol/league/v4/entries/by-summoner/${summonerId}?api_key=${API_KEY}`
      )
      .then((response) => {
        res.json(response.data);
      })
      .catch((err) => res.status(404).send("Summoner Not Found"));
  },

  summonerLeagueInfo: (req, res) => {
    const encryptedSummonerId = req.body.id;
    axios
      .get(
        `https://kr.api.riotgames.com/lol/league/v4/entries/by-summoner/${encryptedSummonerId}?api_key=${API_KEY}`
      )
      .then((response) => {
        if (!response[0] || response[0].wins + response[0].losses < 20) {
          res.status(400).send("Not enough Data to analyze");
        } else {
          res.status(200).json(response.data);
        }
      });
  },

  summonerMatchList: (req, res) => {
    const encryptedAccountId = req.body.accountId;
    axios
      .get(
        `https://kr.api.riotgames.com/lol/match/v4/matchlists/by-account/${encryptedAccountId}?queue=420&api_key=${API_KEY}`
      )
      .then((response) => {
        res.json(response.data);
      });
  },

  summonerLaneRatio: async (req, res) => {
    try {
      // console.log(req.body);

      const encryptedAccountId = req.body.accountId;
      console.log(encryptedAccountId);
      /* const getMatches = axios.get(
      `https://kr.api.riotgames.com/lol/match/v4/matchlists/by-account/${encryptedAccountId}?queue=420&api_key=${API_KEY}`
    ); */
      await axios
        .get(
          `https://kr.api.riotgames.com/lol/match/v4/matchlists/by-account/${encryptedAccountId}?queue=420&api_key=${API_KEY}`
        )
        .then((response) => {
          const matchList = response.body.matches;
          console.log(response.data);

          for (let i = 0; i < matchList.length; i++) {
            const laneCount = {
              TOP: 0,
              JUNGLE: 0,
              MID: 0,
              BOTTOM: 0,
            };

            if (matchList[i].lane === "TOP") {
              laneCount.TOP += 1;
            } else if (matchList[i].lane === "JUNGLE") {
              laneCount.JUNGLE += 1;
            } else if (matchList[i].lane === "MID") {
              laneCount.MID += 1;
            } else if (matchList[i].lane === "BOTTOM") {
              laneCount.BOTTOM += 1;
            } else {
              return;
            }
            return laneCount;
          }
          res.status(200).send("ok");
        });
    } catch (err) {
      console.log(err);
      res.status(400).send("err");
    }
  },

  summonerRecentChampions: async (req, res) => {
    const encryptedAccountId = req.body.accountId;
    const getMatches = axios.get(
      `https://kr.api.riotgames.com/lol/match/v4/matchlists/by-account/${encryptedAccountId}?endIndex=20&api_key=${api_key}`
    );
    const championStats = async (matches) => {
      const recentParticipant = [];
      await Promise.all(
        matches.map(async (match) => {
          const { gameId } = match;
          await axios
            .get(
              `https://kr.api.riotgames.com/lol/match/v4/matches/${gameId}?api_key=${api_key}`
            )
            .then((each) => {
              const { participants, participantIdentities } = each.data;
              const participantId = Object.values(participantIdentities).find(
                (participant) =>
                  participant.player.summonerName === req.body.summonerName
              ).participantId;

              recentParticipant.push(
                participants.find(
                  (participant) => participant.participantId === participantId
                )
              );
            });
        })
      );

      const resultObj = recentParticipant.reduce((obj, val) => {
        if (obj[val.championId]) {
          obj[val.championId].stats.kills =
            obj[val.championId].stats.kills + val.stats.kills;
          obj[val.championId].stats.deaths =
            obj[val.championId].stats.deaths + val.stats.deaths;
          obj[val.championId].stats.assists =
            obj[val.championId].stats.assists + val.stats.assists;
          obj[val.championId].stats.win =
            obj[val.championId].stats.win + val.stats.win;
        } else {
          obj[val.championId] = val;
          obj[val.championId].count = 1;
          obj[val.championId].stats.win = obj[val.championId].stats.win ? 1 : 0;
          obj[val.championId].victoryRate = Math.round(
            (obj[val.championId].stats.win / obj[val.championId].count) * 100
          );
        }
        return obj;
      }, []);
      return resultObj.filter((x) => x).sort((a, b) => b.count - a.count);
    };

    return getMatches.then(async (fetchMatch) => {
      const { matches } = fetchMatch.data;
      return Promise.all([championStats(matches)]).then(([championStats]) => {
        console.log("@@@");
        res.status(200).json(championStats);
      });
    });
  },
};

module.exports.MatchTimelineBy15m;
