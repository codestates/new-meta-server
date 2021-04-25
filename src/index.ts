import https from "https";
import fs from "fs";

import "reflect-metadata";
import { ApolloServer } from "apollo-server-express";
import express from "express";
import { createConnection } from "typeorm";
import { buildSchema } from "type-graphql";
import "dotenv/config";
import cors from "cors";
import morgan from "morgan";

import { logger } from "./config/winston";
import passport from "./lib/passport";

import routes from "./routes";

const main = async () => {
	const app = express();

	// Database와 연결
	if (process.env.NODE_ENV === "development") {
		await createConnection({
			type: "mysql",
			host: "127.0.0.1",
			// port: process.env.DB_PORT,
			username: process.env.LOCAL_DATABASE_USERNAME,
			password: process.env.LOCAL_DATABASE_PASSWORD,
			database: process.env.LOCAL_DATABASE_NAME,
			synchronize: true,
			logging: false,
			entities: ["src/entities/*.*"],
		});
	} else if (process.env.NODE_ENV === "production") {
		await createConnection({
			type: "mysql",
			host: process.env.DB_HOST,
			// port: process.env.DB_PORT,
			username: process.env.DB_USERNAME,
			password: process.env.DB_PASSWORD,
			database: process.env.DB_DBNAME,
			synchronize: true,
			logging: true,
			entities: ["src/entities/*.*"],
		});
	}

	// 각종 미들웨어
	app.use(morgan("dev"));
	app.use(express.json());
	app.use(express.urlencoded({ extended: false }));
	app.use(passport.initialize());
	app.use(
		cors({
			credentials: true,
			origin: true,
			methods: ["GET", "POST", "OPTIONS"],
		})
	);

	// 스키마 설정
	const schema = await buildSchema({
		resolvers: [__dirname + "/resolvers/*.ts"],
	});

	// 아폴로 서버 구동
	const apolloServer = new ApolloServer({
		schema,
		context: ({ req, res }: any) => ({ req, res }),
	});

	// winston testing
	app.get("/", (req, res) => {
		logger.info("GET /");
		res.send("testing...");
	});
	app.get("/error", (req, res) => {
		logger.error("Error message");
		res.sendStatus(500);
	});

	app.use("/", routes);

	apolloServer.applyMiddleware({ app });

	// 서버 구동
	const PORT = 4000;
	let server;
	if (
		fs.existsSync("/etc/letsencrypt/live/new-meta.ga/") &&
		fs.existsSync("/etc/letsencrypt/live/new-meta.ga/")
	) {
		const privateKey = fs.readFileSync(
			"/etc/letsencrypt/live/new-meta.ga/privkey.pem",
			"utf8"
		);
		const certificate = fs.readFileSync(
			"/etc/letsencrypt/live/new-meta.ga/cert.pem",
			"utf8"
		);

		const credentials = { key: privateKey, cert: certificate };
		server = https.createServer(credentials, app);
		server.listen(PORT, () =>
			logger.info(`🚀 HTTPS Server is starting on ${PORT}`)
		);
	} else {
		server = app.listen(PORT);
		console.log(`🚀 HTTP Server is starting on ${PORT}`);
	}
};

main();
