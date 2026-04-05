const app = require('./app');
const connectDatabase = require('./config/db');
const env = require('./config/env');

const startServer = async () => {
  await connectDatabase();

  app.listen(env.port, () => {
    console.log(`Server running on port ${env.port}`);
    console.log(`Swagger docs available at http://localhost:${env.port}/api-docs`);
  });
};

startServer().catch((error) => {
  console.error('Failed to start server:', error.message);
  process.exit(1);
});
