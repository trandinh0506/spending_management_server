const transformData = (array1, array2) => {
    const result = array2.map((item) => {
        let category_color = "";
        let category_name = "";
        array1.forEach((ItemOfArr1) => {
            if (ItemOfArr1.category_id === item.category_id) {
                category_name = ItemOfArr1.category_name;
                category_color = ItemOfArr1.category_color;
            }
        });
        return {
            description: item.description,
            category_id: item.category_id,
            category_name: category_name,
            category_color: category_color,
            amount: item.amount,
            date:
                new Date(item.date).getMonth() + 1 > 9
                    ? `${new Date(item.date).getFullYear()}-${
                          new Date(item.date).getMonth() + 1
                      }-${new Date(item.date).getDate()}`
                    : `${new Date(item.date).getFullYear()}-0${
                          new Date(item.date).getMonth() + 1
                      }-${new Date(item.date).getDate()}`,
        };
    });
    return result;
};

const spendingGet = (token, sessions, connection, res) => {
    console.log("view details, /spendings/chart");
    if (!sessions[token]) {
        console.log("get spending without token");
        console.log("querying database");
        connection.query(
            "SELECT user_id FROM users WHERE token = ? AND dateEXP >= ?",
            [token, new Date().getTime()],
            (err, result) => {
                console.log("query done");
                if (err) {
                    res.send(
                        JSON.stringify({
                            success: 0,
                            message: "Không thể kết nối tới cơ sở dữ liệu!",
                        })
                    );
                }

                if (result[0]) {
                    const user_id = result[0].user_id;
                    connection.query(
                        "SELECT category_name, category_color,category_id FROM categories WHERE user_id = ? ORDER BY category_id;\
                        SELECT description, category_id, amount, date FROM spending WHERE user_id = ? ORDER BY category_id;",
                        [user_id, user_id],
                        (err, data) => {
                            if (err) {
                                res.send(
                                    JSON.stringify({
                                        success: 0,
                                        message:
                                            "Không thể kết nối tới cơ sở dữ liệu!",
                                    })
                                );
                            }
                            const responeData = transformData(data[0], data[1]);
                            console.log(responeData);
                            res.send(
                                JSON.stringify({
                                    success: 1,
                                    spendings: responeData,
                                })
                            );
                        }
                    );
                } else {
                    console.log("no data from database", result);
                    res.send(
                        JSON.stringify({
                            success: 0,
                            message: "Không thể kết nối tới cơ sở dữ liệu!",
                        })
                    );
                }
            }
        );
    } else {
        if (sessions[token].dateEXP >= new Date().getTime()) {
            const user_id = sessions[token].user_id;
            connection.query(
                "SELECT category_name, category_color,category_id FROM categories WHERE user_id = ? ORDER BY category_id;\
                    SELECT description, category_id, amount, date FROM spending WHERE user_id = ? ORDER BY category_id;",
                [user_id, user_id],
                (err, data) => {
                    if (err) {
                        res.send(
                            JSON.stringify({
                                success: 0,
                                message: "Không thể kết nối tới cơ sở dữ liệu!",
                            })
                        );
                    }
                    const responeData = transformData(data[0], data[1]);
                    console.log(responeData);
                    res.send(
                        JSON.stringify({
                            success: 1,
                            spendings: responeData,
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
};

module.exports = { spendingGet };
