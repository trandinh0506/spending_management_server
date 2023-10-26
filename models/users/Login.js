const e = require("cors");
const crypto = require("crypto");
const createToken = (username, password) => {
    const dateEXP = 7 * 24 * 60 * 60 * 1000; // 7 days convert to milliseconds
    return {
        token: crypto
            .createHash("md5")
            .update(username + new Date().getTime().toString() + password)
            .digest("hex"),
        tokenDate: new Date().getTime() + dateEXP,
    };
};

const validateToken = (token, connection, callback) => {
    connection.connection.query(
        "SELECT * FROM users WHERE token = ? and dateEXP >= ?",
        [token, new Date().getTime()],
        (err, data) => {
            if (err) console.log(err);
            callback(data);
        }
    );
};

const Login = (token, sessions, connection, username, password, res) => {
    if (token)
        if (sessions[token]?.dateEXP >= new Date().getTime()) {
            connection.avaliable = 1;
            res.send(JSON.stringify({ success: 1, message: "ok" }));
        } else
            validateToken(token, connection, (result) => {
                connection.avaliable = 1;
                if (result[0]) {
                    if (!sessions[token])
                        sessions[token] = {
                            user_id: result[0].user_id,
                            dateEXP: result[0].dateEXP,
                        };
                    res.send(JSON.stringify({ success: 1, message: "ok" }));
                } else {
                    res.send(
                        JSON.stringify({
                            success: 0,
                            message: "invalid token",
                        })
                    );
                }
            });
    else {
        connection.connection.query(
            "SELECT * FROM users WHERE user_name = ? AND password = ?",
            [username, password],
            (err, data) => {
                connection.avaliable = 1;
                if (err) console.log(err);
                if (data[0]) {
                    if (data[0].dateEXP >= new Date().getTime()) {
                        sessions[data[0].token] = {
                            user_id: data[0].user_id,
                            dateEXP: data[0].dateEXP,
                        };
                        res.send(
                            JSON.stringify({ success: 1, token: data[0].token })
                        );
                    } else {
                        const newToken = createToken(username, password);
                        connection.connection.query(
                            "INSERT INTO users (token, dateEXP) VALUES (?, ?)",
                            [newToken.token, newToken.tokenDate],
                            (err) => {
                                if (err) console.log(err);
                                sessions[newToken.token] = {
                                    user_id: data[0].user_id,
                                    dateEXP: newToken.dateEXP,
                                };
                            }
                        );
                    }
                } else {
                    res.send(
                        JSON.stringify({
                            success: 0,
                            message:
                                "Thông tin tài khoảng hoặc mật khẩu không chính xác!",
                        })
                    );
                }
            }
        );
    }
};

module.exports = { createToken, validateToken, Login };
