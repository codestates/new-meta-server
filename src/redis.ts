import redis from "redis";

import dotenv from "dotenv";
dotenv.config();

export const redisClient = redis.createClient({
	url: process.env.REDIS_URL,
	password: process.env.REDIS_PASSWORD,
});
