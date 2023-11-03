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
    connection.query(
        "SELECT * FROM users WHERE token = ? and dateEXP >= ?",
        [token, new Date().getTime()],
        (err, data) => {
            if (err) console.log(err);
            callback(data);
        }
    );
};

const Login = (token, sessions, connection, username, password, res) => {
    // login using token
    if (token)
        if (sessions[token]?.dateEXP >= new Date().getTime()) {
            res.send(JSON.stringify({ success: 1, message: "ok" }));
        } else
            validateToken(token, connection, (result) => {
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
        // login using username and password
        connection.query(
            "SELECT * FROM users WHERE user_name = ? AND password = ?",
            [username, password],
            (err, data) => {
                if (err) {
                    console.log(err);
                    res.send(
                        JSON.stringify({
                            success: 0,
                            message: "Không thể kết nối tới cơ sở dữ liệu!",
                        })
                    );
                }
                // have valid user
                if (data[0]) {
                    if (data[0].dateEXP >= new Date().getTime()) {
                        // have valid token
                        sessions[data[0].token] = {
                            user_id: data[0].user_id,
                            dateEXP: data[0].dateEXP,
                        };
                        res.send(
                            JSON.stringify({ success: 1, token: data[0].token })
                        );
                    } else {
                        // invalid token => create new token
                        const newToken = createToken(username, password);
                        connection.query(
                            "UPDATE users set token = ? , dateEXP = ? VALUES (?, ?)",
                            [newToken.token, newToken.tokenDate],
                            (err) => {
                                if (err) {
                                    console.log(err);
                                    res.send(
                                        JSON.stringify({
                                            success: 0,
                                            message:
                                                "Không thể kết nối tới cơ sở dữ liệu!",
                                        })
                                    );
                                }
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
