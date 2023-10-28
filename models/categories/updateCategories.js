const updateCategories = (token, sessions, connection, categories, res) => {
    const sqlQuery =
        "DELETE FROM categories where user_id = " +
        categories[0].user_id +
        ";" +
        categories
            .map((category) => {
                return `INSERT INTO categories (user_id, category_id, category_name, category_color) VALUES (${category.user_id}, ${category.category_id}, "${category.category_name}", "${category.category_color}");`;
            })
            .join("");

    if (sessions[token]) {
        connection.query(sqlQuery, (err) => {
            if (err) {
                console.log(err);
                res.send(
                    JSON.stringify({
                        success: 0,
                        message: "Không thể kết nối tới cơ sở dữ liệu!",
                    })
                );
            }
            res.send(
                JSON.stringify({
                    success: 1,
                    message: "Thay đổi đã được lưu lại!",
                })
            );
        });
    } else {
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
                    connection.query(sqlQuery, (err) => {
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
                                message: "Thay đổi đã được lưu lại!",
                            })
                        );
                    });
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

module.exports = { updateCategories };
