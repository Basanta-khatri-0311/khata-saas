import express, { Request, Response, NextFunction } from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./config/db";

import transactionRoute from "./routes/transactionRoutes";
import adminRoute from "./routes/adminRoutes";
import settingsRoute from "./routes/settingsRoutes";
import authRoute from "./routes/authRoutes";
import inventoryRoute from "./routes/inventoryRoutes";
import { startCronJobs } from "./jobs/cronJobs";

dotenv.config();
connectDB();
startCronJobs();

const app = express();

/* Proper CORS configuration */
const corsOptions = {
  origin: ["https://khata-bk.netlify.app", "http://localhost:5173"],
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS", "HEAD"],
  allowedHeaders: ["Content-Type", "Authorization", "x-requested-with"],
  credentials: true,
};

app.use(cors(corsOptions));

app.use(express.json());

app.use("/api/auth", authRoute);
app.use("/api/transactions", transactionRoute);
app.use("/api/admin", adminRoute);
app.use("/api/settings", settingsRoute);
app.use("/api/inventory", inventoryRoute);

const PORT = process.env.PORT || 5200;

app.get("/", (req: Request, res: Response) => {
  res.send("Hello From the Server!");
});

// Handle 404 for undefined API routes
app.use((req: Request, res: Response, next: NextFunction) => {
  res.status(404).json({ message: "API Route Not Found" });
});

// Global error handler
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  console.error(err.stack);
  res.status(500).json({ 
    message: "Server Error", 
    error: process.env.NODE_ENV === 'production' ? null : err.message 
  });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
