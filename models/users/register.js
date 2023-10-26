const { createToken } = require("./Login");

const checkingExistUsernameOrEmail = (
    connection,
    username,
    email,
    callback
) => {
    let alreadyUsername = 0;
    let alreadyEmail = 0;
    let i = 0;
    connection.query(
        "SELECT * FROM users WHERE user_name = ? OR email = ?",
        [username, email],
        (err, result) => {
            if (err) console.log(err);
            if (result[0]) {
                while (result[i]) {
                    if (result[i].user_name === username) alreadyUsername = 1;
                    if (result[i].email === email) alreadyEmail = 1;
                    i++;
                }

                if (alreadyUsername && alreadyEmail) {
                    callback("Tên người dùng và email đã được sử dụng");
                } else {
                    if (alreadyUsername) {
                        callback("Tên người dùng đã được sử dụng");
                    }
                    if (alreadyEmail) {
                        callback("Email đã được sử dụng");
                    }
                }
            } else {
                callback("");
            }
        }
    );
};

const Register = (sessions, connection, username, password, email, res) => {
    checkingExistUsernameOrEmail(connection, username, email, (message) => {
        if (message !== "") {
            res.send(JSON.stringify({ success: 0, message: message }));
        } else {
            const token = createToken(username, password);
            connection.query(
                "INSERT INTO users (user_name, password, email, token, dateEXP) VALUES ( ?, ?, ?, ?, ?);",
                [username, password, email, token.token, token.tokenDate],
                (err, result) => {
                    if (err) console.log(err);
                    sessions[token.token] = {
                        user_id: result.insertId,
                        dateEXP: token.tokenDate,
                    };
                    connection.query(
                        "INSERT INTO categories (user_id, category_id, category_name, category_color) VALUES (?, 1, 'Tiền nhà', '#44b92d');\
        INSERT INTO categories (user_id, category_id, category_name, category_color) VALUES (?, 2, 'Ăn uống', '#5746d2');\
        INSERT INTO categories (user_id, category_id, category_name, category_color) VALUES (?, 3, 'Đi lại', '#efe81f');\
        INSERT INTO categories (user_id, category_id, category_name, category_color) VALUES (?, 4, 'Chi tiêu khác', '#0a3f85');\
                        ",
                        [
                            sessions[token.token].user_id,
                            sessions[token.token].user_id,
                            sessions[token.token].user_id,
                            sessions[token.token].user_id,
                        ],
                        (err) => {
                            if (err) console.log(err);
                            res.send(
                                JSON.stringify({
                                    success: 1,
                                    token: token.token,
                                })
                            );
                        }
                    );
                }
            );
        }
    });
};

module.exports = { Register };
