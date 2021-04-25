import { Router } from "express";
import summoner from "./summoner";
import staticData from "./static";
import auth from "./auth";

const routes = Router();

routes.use("/summoners", summoner);
routes.use("/statics", staticData);
routes.use("/auth", auth);

export default routes;
