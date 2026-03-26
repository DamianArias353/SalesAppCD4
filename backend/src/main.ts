import 'dotenv/config';
import { createApp } from './app';
import { env } from './config/env';
import { buildContainer } from './infrastructure/di/container';

const container = buildContainer();
const app = createApp(container.controllers);

const server = app.listen(env.PORT, () => {
  console.log(`Backend running on http://localhost:${env.PORT}`);
});

const shutdown = async () => {
  server.close(async () => {
    await container.prisma.$disconnect();
    process.exit(0);
  });
};

process.on('SIGINT', shutdown);
process.on('SIGTERM', shutdown);
