import { EnvironmentManager } from "@app/env";
import { createClient, RedisClientType } from "redis";


const redisGlobal = globalThis as unknown as {redis: RedisClientType | undefined}


const redis = redisGlobal.redis ?? createClient({socket: {host: process.env.REDIS_HOST || "localhost", port: Number(process.env.REDIS_PORT) || 6379}})

redis.on("error", (err) => console.error("Redis Client Error", err)).connect();

if (EnvironmentManager.NODE_ENV !== "production") redisGlobal.redis = redis;

export default redis;