import redis from "redis";

// Redis klientini yaratish
const redisClient = redis.createClient({
  url: "redis://localhost:6379", // Redis server manzili
});

export default redisClient;
