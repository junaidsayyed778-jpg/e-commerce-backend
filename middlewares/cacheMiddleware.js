// middlewares/cacheMiddleware.js
import redisClient from "../utils/redisClient.js";

/**
 * Generic cache middleware
 * @param {Function} keyBuilder - function to generate Redis key from req
 * @param {number} ttl - time to live in seconds
 */
const cache = (keyBuilder, ttl = 300) => {
  return async (req, res, next) => {
    let key;

    try {
      // Build Redis key
      key = keyBuilder(req);

      // Check cache
      const cachedData = await redisClient.get(key);
      if (cachedData) {
        // Cache hit
        return res.json(JSON.parse(cachedData));
      }
    } catch (error) {
      console.warn("Redis cache skipped:", error);
      // Do not block request if Redis fails
    }

    // Override res.json to cache the response
    const originalJson = res.json.bind(res);
    res.json = async (body) => {
      try {
        // Only cache successful responses
        if (res.statusCode >= 200 && res.statusCode < 300 && key) {
          await redisClient.setEx(key, ttl, JSON.stringify(body));
        }
      } catch (err) {
        console.warn("Failed to cache response:", err);
      }
      return originalJson(body);
    };

    next(); // continue to next middleware/controller
  };
};

export default cache;
