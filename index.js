const express = require("express");

const cors = require("cors");

require("dotenv").config();
const route = require("./routes");
const app = express();

const corsOptions = {
    origin: process.env.origin,
    methods: "GET,POST",
    allowedHeaders: ["Access-Control-Allow-Origin"],
};
app.get("/wakeup", (req, res) => res.sendStatus(200));
app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", process.env.origin);
    res.header("Access-Control-Allow-Methods", "GET, POST");

    next();
});
app.use(express.json());
app.use(cors(corsOptions));

route(app);

app.listen(8080, () => {
    console.log("listening on port 8080");
});
