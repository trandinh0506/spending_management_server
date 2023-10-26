const spendingPost = (
    token,
    sessions,
    connection,
    description,
    category_id,
    amount,
    date,
    res
) => {
    console.log("spending post", sessions[token]);
    if (sessions[token]) {
        if (sessions[token].dateEXP >= new Date().getTime()) {
            connection.connection.query(
                "INSERT INTO spending (user_id, description, category_id, amount, date) VALUES (?, ?, ?, ?, ?)",
                [
                    sessions[token].user_id,
                    description,
                    category_id,
                    amount,
                    date,
                ],
                (err) => {
                    if (err) {
                        console.log(err);
                        res.send(
                            JSON.stringify({
                                success: 0,
                                message: "Không thể kết nối tới cơ sở dữ liệu!",
                            })
                        );
                    }
                    connection.avaliable = 1;
                    res.send(JSON.stringify({ success: 1, message: "ok" }));
                }
            );
        } else {
            res.send(JSON.stringify({ success: 0, message: "Invalid token" }));
        }
    } else {
        res.send(JSON.stringify({ success: 0, message: "No sessions found" }));
    }
};
module.exports = { spendingPost };
