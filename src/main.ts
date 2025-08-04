import express, { Response } from "express";

import { logger } from "./middleware/logger.middleware";
import { mongoConnection } from "./config/db.connection";
import { handleCustomError } from "./middleware/errorHandler.midleware";
import router from "./routes";
import { limiter } from "./middleware/reate-limit";
import helmet from "helmet";
import cors from "cors";

// import dotenv from "dotenv";
// dotenv.config();
const app = express();

const port = 4000;

app.use(express.json());
app.use(
  cors({
    origin: "http://127.0.0.1:5501",
    methods: "HEAD",
    preflightContinue: false,
    optionsSuccessStatus: 204,
  })
);
// app.use(logger);
app.use(helmet());
app.use(limiter);

app.use("/api/v1", router);
// app.use("/api/v2",router);
app.use(handleCustomError);

//database call

mongoConnection();
app.listen(port, () => {
  console.log(`the server is running on port   ${port}`);
});

// http://localhost:4000/home
