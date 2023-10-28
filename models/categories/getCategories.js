const getCategories = (token, sessions, connection, res) => {
    if (sessions[token])
        connection.query(
            "SELECT * FROM categories WHERE user_id = ? ORDER BY category_id",
            [sessions[token].user_id],
            (err, result) => {
                if (err) {
                    console.log(err);
                    res.send(
                        JSON.stringify({
                            success: 0,
                            message: "Không thể kết nối tới cơ sở dữ liệu!",
                        })
                    );
                }
                res.send(JSON.stringify({ success: 1, categories: result }));
            }
        );
    else {
        connection.query(
            "SELECT * FROM users WHERE token = ? and dateEXP >= ?",
            [token, new Date().getTime()],
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
                if (data[0]) {
                    sessions[token] = {
                        user_id: data[0].user_id,
                        dateEXP: data[0].dateEXP,
                    };
                    connection.query(
                        "SELECT * FROM categories WHERE user_id = ? ORDER BY category_id",
                        [sessions[token].user_id],
                        (err, result) => {
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
                            res.send(
                                JSON.stringify({
                                    success: 1,
                                    categories: result,
                                })
                            );
                        }
                    );
                } else {
                    res.send(
                        JSON.stringify({
                            success: 0,
                            message: "Invalid token!",
                        })
                    );
                }
            }
        );
    }
};
module.exports = { getCategories };
