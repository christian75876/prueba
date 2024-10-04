import { config } from 'dotenv';

config();

export const EnvConfig = () => ({
  mongoUri: process.env.MONGO_URI,
  executeSeeds: process.env.EXECUTE_SEEDS === 'true',
});
