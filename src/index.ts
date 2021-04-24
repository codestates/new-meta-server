import https from "https";
import fs from "fs";

import "reflect-metadata";
import { ApolloServer } from "apollo-server-express";
import express, { Request, Response } from "express";
import morgan from "morgan";
import { buildSchema } from "type-graphql";
import { createConnection } from "typeorm";
import cors from "cors";
import { logger } from "./config/winston";
import passport from "./lib/passport";
import "dotenv/config";

import { generateToken } from "./lib/jwt";

import routes from "./routes";

const main = async () => {
	const app = express();

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

	app.use(morgan("dev"));
	app.use(express.json());
	app.use(express.urlencoded({ extended: false }));

	const schema = await buildSchema({
		resolvers: [__dirname + "/resolvers/*.ts"],
	});

	const apolloServer = new ApolloServer({
		schema,
		context: ({ req, res }: any) => ({ req, res }),
	});

	app.use(
		cors({
			credentials: true,
			origin: true,
			methods: ["GET", "POST", "OPTIONS"],
		})
	);

	// winston testing
	app.get("/", (req, res) => {
		logger.info("GET /");
		res.send("testing...");
	});
	app.get("/error", (req, res) => {
		logger.error("Error message");
		res.sendStatus(500);
	});

	// oAuth

	app.use(passport.initialize());
	app.get(
		"/auth/google",
		passport.authenticate("google", {
			scope: ["profile", "email"],
			session: false,
		})
	);
	app.get(
		"/auth/google/callback",
		passport.authenticate("google", {
			failureRedirect: "http://localhost:3000",
			session: false,
		}),
		function (req: Request, res: Response) {
			const userData: any = req.user;
			const { id, email, nickname } = userData;

			const token = generateToken(id, email, nickname);

			res.redirect(`http://localhost:3000/?token=${token}`);
		}
	);

	app.get(
		"/auth/facebook",
		passport.authenticate("facebook", {
			session: false,
		})
	);
	app.get(
		"/auth/facebook/callback",
		passport.authenticate("facebook", {
			failureRedirect: "http://localhost:3000",
			session: false,
		}),
		function (req, res) {
			const userData: any = req.user;
			const { id, email, nickname } = userData;

			const token = generateToken(id, email, nickname);

			res.redirect(`http://localhost:3000/?token=${token}`);
		}
	);

	app.get(
		"/auth/github",
		passport.authenticate("github", { scope: ["user:email"], session: false })
	);
	app.get(
		"/auth/github/callback",
		passport.authenticate("github", {
			failureRedirect: "http://localhost:3000",
			session: false,
		}),
		function (req, res) {
			const userData: any = req.user;
			const { id, email, nickname } = userData;

			const token = generateToken(id, email, nickname);

			res.redirect(`http://localhost:3000/?token=${token}`);
		}
	);

	app.use("/", routes);

	apolloServer.applyMiddleware({ app });

	// apolloServer.start();
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
		server.listen(
			PORT,
			() => logger.info(`🚀 HTTPS Server is starting on ${PORT}`)
			// console.log(`🚀 HTTPS Server is starting on ${PORT}`)
		);
	} else {
		server = app.listen(PORT);
		console.log(`🚀 HTTP Server is starting on ${PORT}/graphql`);
	}

	// app.listen(PORT, () => console.log(`Server is up on port ${PORT}/graphql`));
};

main();
