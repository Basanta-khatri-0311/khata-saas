const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const connectDB = require("./config/db");

const transactionRoute = require("./routes/transactionRoutes");
const adminRoute = require("./routes/adminRoutes");
const settingsRoute = require("./routes/settingsRoutes");
const authRoute = require("./routes/authRoutes");

dotenv.config();
connectDB();

const app = express();

/* Proper CORS configuration */
app.use(cors({
  origin: ["https://khata-bk.netlify.app"],
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));

/* Handle preflight requests */
app.options("*", cors());

app.use(express.json());

app.use("/api/auth", authRoute);
app.use("/api/transactions", transactionRoute);
app.use("/api/admin", adminRoute);
app.use("/api/settings", settingsRoute);

const PORT = process.env.PORT || 5200;

app.get("/", (req, res) => {
  res.send("Hello From the Server!");
});

// Handle 404 for undefined API routes
app.use("*", (req, res) => {
  res.status(404).json({ message: "API Route Not Found" });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ 
    message: "Server Error", 
    error: process.env.NODE_ENV === 'production' ? null : err.message 
  });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
