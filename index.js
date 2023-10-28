const express = require("express");

const cors = require("cors");

require("dotenv").config();
const route = require("./routes");
const app = express();

const corsOptions = {
    origin: [process.env.origin],
    methods: "GET,POST",
    allowedHeaders: [
        "Access-Control-Allow-Origin",
        "Authorization",
        "Content-Type",
    ],
};
app.use(express.json());
app.use(cors(corsOptions));
app.options("*", cors(corsOptions));
app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", process.env.origin);
    res.header("Access-Control-Allow-Methods", "GET, POST");
    res.header("Access-Control-Allow-Headers", "Authorization, Content-Type");
    next();
});
app.get("/wakeup", (req, res) => res.sendStatus(200));

route(app);

app.listen(8080, () => {
    console.log("listening on port 8080");
});
