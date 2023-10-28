const mysql = require("mysql");

const { Login } = require("./Login");
const { Register } = require("./register");
const spending = require("../spendings");
const categories = require("../categories");

class users {
    constructor() {
        this.sessions = {};
        this.connection = mysql.createPool({
            connectionLimit: 10,
            host: process.env.host,
            port: 3306,
            user: process.env.user,
            password: process.env.password,
            database: process.env.database,
            multipleStatements: true,
        });
    }
    login(token, username, password, res) {
        Login(token, this.sessions, this.connection, username, password, res);
    }
    register(username, password, email, res) {
        Register(
            this.sessions,
            this.connection,
            username,
            password,
            email,
            res
        );
    }
    add(token, description, category_id, amount, date, res) {
        spending.post(
            token,
            this.sessions,
            this.connection,
            description,
            category_id,
            amount,
            date,
            res
        );
    }
    getCategories(token, res) {
        categories.get(token, this.sessions, this.connection, res);
    }
    getSpending(token, res) {
        spending.get(token, this.sessions, this.connection, res);
    }
    update(token, categories_, res) {
        categories.update(
            token,
            this.sessions,
            this.connection,
            categories_,
            res
        );
    }
}

module.exports = new users();
