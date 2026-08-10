export default () => ({
  port: parseInt(process.env.PORT || '3002', 10),
  redisHost: process.env.REDIS_HOST || 'localhost',
  redisPort: parseInt(process.env.REDIS_PORT || '6379', 10),
});
