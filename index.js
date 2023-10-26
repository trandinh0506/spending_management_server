const express = require("express");
const mysql = require("mysql");
const cors = require("cors");

require("dotenv").config();
const route = require("./routes");
const app = express();

const corsOptions = {
    origin: process.env.origin,
    methods: "GET,POST",
};
const now = new Date().getTime();

app.use(express.json());
app.use(cors(corsOptions));

route(app);

app.listen(8000, () => {
    console.log("listening on port 8000");
});
