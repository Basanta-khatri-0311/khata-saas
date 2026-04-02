const express = require("express");
const cors = require("cors");

const app = express();


app.use(cors()); //for cross-origin requests
app.use(express.json()); //for parsing application/json


const PORT = process.env.PORT || 5500;

app.get("/", (req, res) => {
    res.send("Hello From the Server!");
})

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});