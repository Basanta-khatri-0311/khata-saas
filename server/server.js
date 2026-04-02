const express = require("express"); //for creating the server
const cors = require("cors"); //for handling cross-origin requests
const dotenv = require("dotenv"); //for loading environment variables
const connectDB = require("./config/db"); //for connecting to the database
const transactionRoute = require("./routes/transactionRoutes"); //for handling transaction-related routes


dotenv.config(); // Load environment variables from .env file
connectDB(); // Connect to the database

const app = express();


app.use(cors()); //for cross-origin requests
app.use(express.json()); //for parsing application/json
app.use("/api/transactions", transactionRoute); // Use the transactionRoute for handling transaction-related routes


const PORT = process.env.PORT || 5200;

app.get("/", (req, res) => {
    res.send("Hello From the Server!");
})

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});