const express = require("express");

const cors = require("cors");

require("dotenv").config();
const route = require("./routes");
const app = express();

const corsOptions = {
    origin: process.env.origin,
    methods: "GET,POST",
};
app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", process.env.origin); // Make sure process.env.origin is set correctly
    res.header("Access-Control-Allow-Methods", "GET, POST");

    next(); // Pass control to the next middleware
});
app.use(express.json());
app.use(cors(corsOptions));

route(app);

app.listen(8080, () => {
    console.log("listening on port 8080");
});
