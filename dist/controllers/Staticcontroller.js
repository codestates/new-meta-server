"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ItemInfo = exports.ChampionInfo = void 0;
const axios_1 = require("axios");
const dotenv = require("dotenv");
dotenv.config();
const patchVer = process.env.PATCH_VERSION;
/* static data */
class StaticController {
}
StaticController.ChampionInfo = (req, res) => {
    return axios_1.default
        .get(`http://ddragon.leagueoflegends.com/cdn/${patchVer}/data/ko_KR/champion.json`)
        .then((response) => {
        res.status(200).json(response.data);
    })
        .catch((err) => res.status(404).send("Champion Data Not Found"));
};
StaticController.ItemInfo = (req, res) => {
    return axios_1.default
        .get(`http://ddragon.leagueoflegends.com/cdn/${patchVer}/data/ko_KR/item.json`)
        .then((response) => {
        res.status(200).json(response.data);
    })
        .catch((err) => res.status(404).send("Item Data Not Found"));
};
exports.default = StaticController;
function ChampionInfo(arg0, ChampionInfo) {
    throw new Error("Function not implemented.");
}
exports.ChampionInfo = ChampionInfo;
function ItemInfo(arg0, ItemInfo) {
    throw new Error("Function not implemented.");
}
exports.ItemInfo = ItemInfo;
//# sourceMappingURL=StaticController.js.map