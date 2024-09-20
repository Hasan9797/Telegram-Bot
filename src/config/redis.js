import redis from "redis";

// Redis klientini yaratish
const redisClient = redis.createClient({
  url: "redis://localhost:6379", // Redis server manzili
});

// Redisga ulanish
redisClient.connect();
redisClient.on("error", (err) => console.log("Redis Client Error", err));

export default redisClient;
