import express from "express"
import dotenv from "dotenv"
dotenv.config();
import connectDb from "./config/connectDb.js"
import cors from "cors"
import cookieParser from "cookie-parser";

const app = express();
app.use(express.json());
app.use(cookieParser());

app.use(cors({
    origin: "http://localhost:5173",
    credentials: true
}))


//routes
import authRoute from "./routes/auth.route.js";
import userRoute from "./routes/user.route.js";

app.use("/api/auth", authRoute);
app.use("/api/user", userRoute);

const PORT = process.env.PORT || 6000
app.listen(PORT, ()=>{
    console.log(`server running on PORT ${PORT}`);
    connectDb();
})
  