// require
import "reflect-metadata";
import { createConnection } from "typeorm";
import * as express from "express";
import * as bodyParser from "body-parser";
import * as cors from "cors";
import * as morgan from "morgan";

import routes from "./routes";

// TypeORM 구동
createConnection()
	.then(async (connection) => {
		console.log("Database connected...");

		// 기본 설정
		const app = express();
		app.use(bodyParser.json());
		app.use(morgan("dev"));

		app.use(
			cors({
				origin: true,
				credentials: true,
				methods: ["GET", "POST", "OPTIONS", "PATCH", "DELETE"],
			})
		);

		// 라우트
		app.use("/", routes);

		// 서버 구동
		const PORT = 4000;
		app.listen(PORT, () => {
			console.log(`Express application is up and running on port ${PORT}`);
		});
	})
	.catch((err) => console.log(err));
