import { Router } from "express";
import user from "./user";
import summoner from "./summoner";
import staticData from "./static";

const routes = Router();

routes.use("/users", user);
routes.use("/summoners", summoner);
routes.use("/statics", staticData);

export default routes;
