const usersModel = require("../models/users");
class UsersController {
    index() {}
    login(req, res) {
        const { username, password } = req.body;
        usersModel.login(req.headers.authorization, username, password, res);
    }
    register(req, res) {
        const { username, password, email } = req.body;
        usersModel.register(username, password, email, res);
    }
    add(req, res) {
        const { description, category_id, amount, date } = req.body;

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
        usersModel.getCategories(req.headers.authorization, res);
    }
    getSpending(req, res) {
        usersModel.getSpending(req.headers.authorization, res);
    }
}
module.exports = new UsersController();
