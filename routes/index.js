const usersRouter = require("./users");

const route = (app) => {
    app.use("/users", usersRouter);
    app.get("/", (req, res) => {
        res.send("aloalo");
    });
};

module.exports = route;
