const usersModel = require("../models/users");
class UsersController {
    index() {}
    login(req, res) {
        const { username, password } = req.body;
        console.log("login controller");
        usersModel.login(req.headers.authorization, username, password, res);
    }
    register(req, res) {
        const { username, password, email } = req.body;
        console.log("register controller");
        usersModel.register(username, password, email, res);
    }
    add(req, res) {
        const { description, category_id, amount, date } = req.body;
        console.log("add controller");
        usersModel.add(
            req.headers.authorization,
            description,
            category_id,
            amount,
            date,
            res
        );
    }
    categories(req, res) {
        console.log("categories controller (get categories)");
        usersModel.getCategories(req.headers.authorization, res);
    }
    getSpending(req, res) {
        console.log("spending controller");
        usersModel.getSpending(req.headers.authorization, res);
    }
}
module.exports = new UsersController();
