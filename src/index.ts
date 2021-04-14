import "reflect-metadata";
import { ApolloServer } from "apollo-server-express";
import express from "express";
import { buildSchema } from "type-graphql";
import { createConnection } from "typeorm";
import session from "express-session";
import connectRedis from "connect-redis";
import cors from "cors";
import dotenv from "dotenv";
import routes from "./routes";
dotenv.config();

import { redisClient } from "./redis";
// import { send } from "process";

const main = async () => {
  await createConnection();

  const schema = await buildSchema({
    resolvers: [__dirname + "/resolvers/*.ts"],
  });

  const apolloServer = new ApolloServer({
    schema,
    context: ({ req, res }: any) => ({ req, res }),
  });

  const app = express();

  const RedisStore = connectRedis(session);

  app.use(
    cors({
      credentials: true,
      origin: "http://localhost:4000",
    })
  );

  app.use(
    session({
      store: new RedisStore({
        client: redisClient,
      }),
      name: "auth",
      secret: process.env.SESSION_SECRET as string,
      resave: false,
      saveUninitialized: true,
      cookie: {
        httpOnly: true,
        secure: false,
        maxAge: 1000 * 60 * 60 * 24 * 30, // 30 days
      },
    })
  );
  app.use("/", routes);

  apolloServer.applyMiddleware({ app });

  const PORT = 4000;
  app.listen(PORT, () => console.log(`Server is up on port ${PORT}/graphql`));
};

main();
