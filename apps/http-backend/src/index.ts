import express from "express"
import cors from "cors";
import userRouter from "./routes/user";

const app = express();

app.use(express.json());
app.use(cors({
  origin: "http://localhost:3000",
  credentials: true
}));

app.use("/api/v1/user", userRouter)

app.listen(8080, () => console.log("http-backend is running on port 8080..."));