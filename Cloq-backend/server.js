import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import helmet from "helmet";
import connectDB from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";

dotenv.config();

const app = express();

// security + JSON support
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use("/api/auth", authRoutes);

// connect database
connectDB();

// base route
app.get("/", (req, res) => {
  res.send("Password Vault Backend Running...");
});

// start server
app.listen(process.env.PORT || 5000, () =>
  console.log(`Server running on port ${process.env.PORT}`)
);
