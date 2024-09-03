import express, { Request, Response } from "express";
import dotenv from "dotenv";
import cors from "cors";
import "express-async-errors";
import connectDB from "./db/connect";
import errorHandlerMiddleware from "./middlewares/error-handler";
import notFound from "./middlewares/not-found";
import authRouter from "./routes/auth";
import employeesRouter from "./routes/employees";
import tasksRouter from "./routes/tasks";
import helmet from "helmet";
import cookieParser from "cookie-parser";
import verifyJwt from "./middlewares/verify-jwt";
import { corsOptions } from "./config";
dotenv.config();
const app = express();

app.use(cookieParser());

app.use(
  cors({
    origin: "http://localhost:5173", // Your React app's origin
    credentials: true, // This is necessary for cookies to be sent
  })
);
// app.use(helmet());

app.use(express.json());

app.get("/", async (req: Request, res: Response) => {
  res.send("Runinng Express With TS!!!");
});

app.use("/api/v1/auth", authRouter);

app.use(verifyJwt);
app.use("/api/v1/employees", employeesRouter);
app.use("/api/v1/tasks", tasksRouter);

app.use(notFound);
app.use(errorHandlerMiddleware);
const port = process.env.PORT || 5000;

const start = async () => {
  try {
    await connectDB(process.env.MONGO_URI);
    app.listen(port, () =>
      console.log(`Server is listening on port ${port}...`)
    );
  } catch (error) {
    console.log(error);
  }
};

start();
