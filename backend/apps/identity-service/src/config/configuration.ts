export default () => ({
  port: parseInt(process.env.IDENTITY_SERVICE_PORT || '3001', 10),
  database: {
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '5432', 10),
    username: process.env.DB_USERNAME || 'postgres',
    password: process.env.DB_PASSWORD || 'postgrespassword',
    name: process.env.DB_DATABASE || 'visual_rag_db',
  },
  jwt: {
    secret: process.env.JWT_SECRET || 'visual-rag-secret-jwt-key-2026',
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
  },
  google: {
    clientId: process.env.GOOGLE_CLIENT_ID || '',
  },
});
