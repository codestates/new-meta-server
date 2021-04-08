var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
const axios = require("axios");
const dotenv = require("dotenv");
dotenv.config();
const patchVer = process.env.PATCH_VERSION;
/* static data */
module.exports.ChampionInfo = (req, res) => __awaiter(this, void 0, void 0, function* () {
    return axios
        .get(`http://ddragon.leagueoflegends.com/cdn/${patchVer}/data/ko_KR/champion.json`)
        .then((response) => {
        return {
            statusCode: 200,
            body: JSON.stringify({
                data: response.data,
            }),
        };
    });
});
module.exports.ItemInfo = (req, res) => __awaiter(this, void 0, void 0, function* () {
    return axios.get(`http://ddragon.leagueoflegends.com/cdn/${patchVer}/data/ko_KR/item.json`);
});
//# sourceMappingURL=static.js.map