const express = require("express");
const axios = require("axios");
const dotenv = require("dotenv");
const { response } = require("express");
dotenv.config();
const API_KEY = process.env.API_KEY;

/* API Data */
/* 클라이언트에서 사용자 소환사명과 포지션을 request로 받은 경우 */
module.exports = {
  summonerInfo: async (req, res) => {
    console.log(req.body);
    const summonerName = encodeURI(req.body.summonerName);
    return axios
      .get(
        `https://kr.api.riotgames.com/lol/summoner/v4/summoners/by-name/${summonerName}?api_key=${API_KEY}`
      )
      .then((response) => {
        console.log(response);
        res.send(response.data);
      })
      .catch((err) => res.status(404).send("Summoner Not Found"));
  },

  summonerLeagueInfo: (req, res) => {
    const encryptedSummonerId = req.body.id;
    return axios
      .get(
        `https://kr.api.riotgames.com/lol/league/v4/entries/by-summoner/${encryptedSummonerId}?api_key=${API_KEY}`
      )
      .then((response) => {
        console.log(response.data);
        if (
          !response.data[0] ||
          response.data[0].wins + response.data[0].losses < 20
        ) {
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

  summonerLaneRatio: (req, res) => {
    const encryptedAccountId = req.body.accountId;
    console.log(encryptedAccountId);

    return axios
      .get(
        `https://kr.api.riotgames.com/lol/match/v4/matchlists/by-account/${encryptedAccountId}?queue=420&endIndex=100&api_key=${API_KEY}`
      )
      .then((response) => {
        const matchList = response.data.matches;
        console.log(matchList.length);
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
            laneCount.BOTTOM += 1;
          } else if (matchList[i].lane === "NONE") {
            laneCount.SUPPORT += 1;
          }
        }
        res.status(200).send(laneCount);
      });
  },

  summonerRecentChampions: async (req, res) => {
    /* getMatches로  */
    try {
      const accountId = req.body.accountId;
      const summonerName = req.body.name;
      const enCodeSummonerName = encodeURI(summonerName);
      const getMatches = await axios
        .get(
          `https://kr.api.riotgames.com/lol/match/v4/matchlists/by-account/${accountId}?endIndex=20&api_key=${API_KEY}&summonerName=${enCodeSummonerName}`
        )
        .then((response) => response.data);
      const getMatchId = (matches) => {
        matches.map((match) => {});
      };
    } catch (err) {
      console.log(err);
    }
  },
};
