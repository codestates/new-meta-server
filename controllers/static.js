const axios = require("axios");
const dotenv = require("dotenv");
dotenv.config();
const patchVer = process.env.PATCH_VERSION;

/* static data */
module.exports.ChampionInfo = async (req, res) => {
  return axios
    .get(
      `http://ddragon.leagueoflegends.com/cdn/${patchVer}/data/ko_KR/champion.json`
    )
    .then((response) => {
      return {
        statusCode: 200,
        body: JSON.stringify({
          data: response.data,
        }),
      };
    });
};

module.exports.ItemInfo = async (req, res) => {
  return axios.get(
    `http://ddragon.leagueoflegends.com/cdn/${patchVer}/data/ko_KR/item.json`
  );
};
