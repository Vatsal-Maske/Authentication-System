import express from "express"
import morgan from "morgan";//it is an dogger for logging http request and response in the console
import authRouter from "./routes/auth.routes.js";
const app = express();

app.use(express.json());

app.use(morgan("dev"));

app.use("/api/auth",authRouter);

export default app;