export default () => ({
  port: parseInt(process.env.PORT || '3000', 10),
  jwtSecret: process.env.JWT_SECRET || 'super-secret-jwt-key',
  rateLimitLimit: 100,
  rateLimitTtl: 60
});
