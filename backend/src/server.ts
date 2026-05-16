import { createApp } from "./app";
import { connectDatabase } from "./config/database";
import { env } from "./config/env";

const startServer = async (): Promise<void> => {
  await connectDatabase();

  const app = createApp();

  app.listen(env.port, () => {
    console.info(`Server running on port ${env.port}`);
  });
};

void startServer().catch((error: unknown) => {
  const message = error instanceof Error ? error.message : "Unknown startup error";
  console.error(`Failed to start server: ${message}`);
  process.exit(1);
});
