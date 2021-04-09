import { Router } from "express";
import user from "./user";
import summoner from "./summoner";

const routes = Router();

routes.use("/users", user);
routes.use("/summoners", summoner);

export default routes;
