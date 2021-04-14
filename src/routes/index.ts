import { Router } from "express";
import summoner from "./summoner";
import staticData from "./static";

const routes = Router();

routes.use("/summoners", summoner);
routes.use("/statics", staticData);

export default routes;
