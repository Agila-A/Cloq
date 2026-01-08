import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import helmet from "helmet";
import connectDB from "./config/db.js";
import vaultRoutes from "./routes/vaultRoutes.js";

dotenv.config();

const app = express();

// middleware
app.use(helmet());
app.use(cors());
app.use(express.json());

// DB
connectDB();

// routes
app.use("/api/vault", vaultRoutes);

// base route
app.get("/", (req, res) => {
  res.send("Password Vault Backend Running...");
});

app.listen(process.env.PORT || 5000, () =>
  console.log(`Server running on port ${process.env.PORT}`)
);
