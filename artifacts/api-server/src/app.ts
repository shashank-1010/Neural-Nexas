import express, { type Express } from "express";
import cors from "cors";
import mongoose from "mongoose";
import pinoHttp from "pino-http";
import router from "./routes";
import { logger } from "./lib/logger";
import { seedData } from "./seed";

const app: Express = express();

app.use(
  pinoHttp({
    logger,
    serializers: {
      req(req) {
        return { id: req.id, method: req.method, url: req.url?.split("?")[0] };
      },
      res(res) {
        return { statusCode: res.statusCode };
      },
    },
  })
);

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api", router);

const MONGODB_URI = process.env.MONGODB_URI || "";

export async function connectDB(): Promise<void> {
  if (!MONGODB_URI) {
    logger.warn("MONGODB_URI not set — running without MongoDB. Set it in Secrets.");
    return;
  }
  try {
    await mongoose.connect(MONGODB_URI);
    logger.info("MongoDB connected");
    await seedData();
  } catch (err) {
    logger.error({ err }, "MongoDB connection failed");
  }
}

export default app;
