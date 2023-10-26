const express = require("express");

const cors = require("cors");

require("dotenv").config();
const route = require("./routes");
const app = express();

// const corsOptions = {
//     origin: process.env.origin,
//     methods: "GET,POST",
//     allowedHeaders: ["Access-Control-Allow-Origin"],
// };
app.use(express.json());
app.use(cors());
console.log(process.env.origin);
app.get("/wakeup", (req, res) => res.sendStatus(200));
app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "GET, POST");

    next();
});

route(app);

app.listen(8080, () => {
    console.log("listening on port 8080");
});
