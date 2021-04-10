import { Request, Response } from "express";
import axios from "axios";
import * as dotenv from "dotenv";
dotenv.config();
const patchVer = process.env.PATCH_VERSION;

/* static data */
class StaticController {
  static ChampionInfo = (req: Request, res: Response) => {
    return axios
      .get(
        `http://ddragon.leagueoflegends.com/cdn/${patchVer}/data/ko_KR/champion.json`
      )
      .then((response) => {
        res.status(200).json(response.data);
      })
      .catch((err) => res.status(404).send("Champion Data Not Found"));
  };

  static ItemInfo = (req: Request, res: Response) => {
    return axios
      .get(
        `http://ddragon.leagueoflegends.com/cdn/${patchVer}/data/ko_KR/item.json`
      )
      .then((response) => {
        res.status(200).json(response.data);
      })
      .catch((err) => res.status(404).send("Item Data Not Found"));
  };
}

export default StaticController;
export function ChampionInfo(arg0: string, ChampionInfo: any) {
  throw new Error("Function not implemented.");
}

export function ItemInfo(arg0: string, ItemInfo: any) {
  throw new Error("Function not implemented.");
}
