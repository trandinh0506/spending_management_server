const getCategories = (token, sessions, connection, res) => {
    if (sessions[token])
        connection.connection.query(
            "SELECT * FROM categories WHERE user_id = ? ORDER BY category_id",
            [sessions[token].user_id],
            (err, result) => {
                connection.avaliable = 1;
                if (err) throw err;
                console.log(result);
                res.send(JSON.stringify({ success: 1, categories: result }));
            }
        );
    else {
        connection.connection.query(
            "SELECT * FROM users WHERE token = ? and dateEXP >= ?",
            [token, new Date().getTime()],
            (err, data) => {
                if (err) throw err;
                sessions[token] = {
                    user_id: data[0].user_id,
                    dateEXP: data[0].dateEXP,
                };
                connection.connection.query(
                    "SELECT * FROM categories WHERE user_id = ? ORDER BY category_id",
                    [sessions[token].user_id],
                    (err, result) => {
                        console.log(result);
                        connection.avaliable = 1;
                        if (err) throw err;
                        res.send(
                            JSON.stringify({ success: 1, categories: result })
                        );
                    }
                );
            }
        );
    }
};
module.exports = { getCategories };
