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
        this.loginConnections = [
            { connection: null, avaliable: 0 },
            { connection: null, avaliable: 0 },
        ]; // [connection, avaliable]
        for (let i = 0; i < 2; i++) {
            this.connection.getConnection((err, connection) => {
                if (!err) {
                    this.loginConnections[i].connection = connection;
                    this.loginConnections[i].avaliable = 1;
                    console.log("login connection", i);
                }
            });
        }
        this.registerConnections = [
            { connection: null, avaliable: 0 },
            { connection: null, avaliable: 0 },
        ]; // [connection, avaliable]
        for (let i = 0; i < 2; i++) {
            this.connection.getConnection((err, connection) => {
                if (!err) {
                    this.registerConnections[i].connection = connection;
                    this.registerConnections[i].avaliable = 1;
                    console.log("register connection", i);
                }
            });
        }
        this.spendingConnections = [];
        for (let i = 0; i < 2; i++) {
            this.connection.getConnection((err, connection) => {
                console.log("spending connections: ", i);
                if (err) console.log(err);
                else {
                    console.log("spending connection", i);
                    this.spendingConnections.push({
                        connection: connection,
                        avaliable: 1,
                    });
                }
            });
        }
        this.loginQueue = [];
        this.registerQueue = [];
        this.spendingQueue = [];
        this.getCategoriesQueue = [];
        this.getSpendingQueue = [];

        // event loop
        setInterval(() => {
            // login
            while (
                this.loginQueue.length &&
                this.loginConnections.some((connect) => connect.avaliable)
            ) {
                console.log("using event loop to login");
                for (let i = 0; i < this.loginConnections.length; i++) {
                    if (this.loginConnections[i].avaliable) {
                        const curr = this.loginQueue.shift();
                        if (curr)
                            Login(
                                curr.token,
                                this.sessions,
                                this.loginConnections[i],
                                curr.username,
                                curr.password,
                                curr.res
                            );
                    }
                }
            }
            // register
            while (
                this.registerQueue.length &&
                this.registerConnections.some((connect) => connect.avaliable)
            ) {
                console.log("register in event loop");

                for (let i = 0; i < this.registerConnections.length; i++) {
                    if (this.registerConnections[i].avaliable) {
                        const curr = this.registerQueue.shift();
                        if (curr)
                            Register(
                                this.sessions,
                                this.registerConnections[i],
                                curr.username,
                                curr.password,
                                curr.email,
                                curr.res
                            );
                    }
                }
            }
            // spending
            while (
                this.spendingQueue.length &&
                this.spendingConnections.some((connect) => connect.avaliable)
            ) {
                console.log("spending in event loop");

                for (let i = 0; i < this.spendingConnections.length; i++) {
                    if (this.spendingConnections[i].avaliable) {
                        const curr = this.spendingQueue.shift();
                        if (curr)
                            categories.get(
                                curr.token,
                                this.sessions,
                                this.spendingConnections[i],
                                curr.res
                            );
                    }
                }
            }
            // get all categories
            while (
                this.getCategoriesQueue.length &&
                this.spendingConnections.some((connect) => connect.avaliable)
            ) {
                console.log("get categories in event loop");

                for (let i = 0; i < this.spendingConnections.length; i++) {
                    if (this.spendingConnections[i].avaliable) {
                        const curr = this.getCategoriesQueue.shift();
                        if (curr)
                            spending.post(
                                curr.token,
                                this.sessions,
                                this.spendingConnections[i],
                                curr.description,
                                curr.category_id,
                                curr.amount,
                                curr.date,
                                curr.res
                            );
                    }
                }
            }
            // get spending queue
            while (
                this.getSpendingQueue.length &&
                this.spendingConnections.some((connect) => connect.avaliable)
            ) {
                console.log("get categories in event loop");

                for (let i = 0; i < this.spendingConnections.length; i++) {
                    if (this.spendingConnections[i].avaliable) {
                        const curr = this.getCategoriesQueue.shift();
                        if (curr)
                            spending.get(
                                curr.token,
                                this.sessions,
                                this.spendingConnections[i],
                                curr.res
                            );
                    }
                }
            }
        }, 2);
    }
    login(token, username, password, res) {
        if (this.loginConnections.some((connection) => connection.avaliable)) {
            for (let i = 0; i < this.loginConnections.length; i++) {
                if (this.loginConnections[i].avaliable) {
                    this.loginConnections[i].avaliable = 0;
                    console.log("use login connection", i);
                    Login(
                        token,
                        this.sessions,
                        this.loginConnections[i],
                        username,
                        password,
                        res
                    );
                    break;
                }
            }
        } else {
            this.loginQueue.push({
                token,
                username,
                password,
                res,
            });
        }
    }
    register(username, password, email, res) {
        if (
            this.registerConnections.some((connection) => connection.avaliable)
        ) {
            for (let i = 0; i < this.registerConnections.length; i++) {
                if (this.registerConnections[i].avaliable) {
                    this.registerConnections[i].avaliable = 0;
                    console.log("use register connection", i);
                    Register(
                        this.sessions,
                        this.registerConnections[i],
                        username,
                        password,
                        email,
                        res
                    );
                    break;
                }
            }
        } else {
            console.log("push register to queue");
            this.registerQueue.push({
                username,
                password,
                email,
                res,
            });
        }
    }
    add(token, description, category_id, amount, date, res) {
        if (
            this.spendingConnections.some((connection) => connection.avaliable)
        ) {
            for (let i = 0; i < this.spendingConnections.length; i++) {
                if (this.spendingConnections[i].avaliable) {
                    this.spendingConnections[i].avaliable = 0;
                    console.log("use spending connection", i);
                    spending.post(
                        token,
                        this.sessions,
                        this.spendingConnections[i],
                        description,
                        category_id,
                        amount,
                        date,
                        res
                    );
                    break;
                }
            }
        } else {
            console.log("push spending to queue");
            this.spendingQueue.push({
                token,
                description,
                category_id,
                amount,
                date,
                res,
            });
        }
    }
    getCategories(token, res) {
        if (
            this.spendingConnections.some((connection) => connection.avaliable)
        ) {
            for (let i = 0; i < this.spendingConnections.length; i++) {
                if (this.spendingConnections[i].avaliable) {
                    this.spendingConnections[i].avaliable = 0;
                    console.log("use spending connection on get categories", i);
                    categories.get(
                        token,
                        this.sessions,
                        this.spendingConnections[i],
                        res
                    );
                    break;
                }
            }
        } else {
            console.log("push get categories to queue");
            this.getCategoriesQueue.push({
                token,
                res,
            });
        }
    }
    getSpending(token, res) {
        if (
            this.spendingConnections.some((connection) => connection.avaliable)
        ) {
            for (let i = 0; i < this.spendingConnections.length; i++) {
                if (this.spendingConnections[i].avaliable) {
                    this.spendingConnections[i].avaliable = 0;
                    console.log("use spending connection on get spending", i);
                    spending.get(
                        token,
                        this.sessions,
                        this.spendingConnections[i],
                        res
                    );
                    break;
                }
            }
        } else {
            console.log("push get spending to queue");
            this.getSpendingQueue.push({
                token,
                res,
            });
        }
    }
}

module.exports = new users();
