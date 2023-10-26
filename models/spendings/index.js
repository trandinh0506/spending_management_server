const { spendingPost } = require("./spendingPost");
const { spendingGet } = require("./spendingGet");
class spending {
    get(token, sessions, connection, res) {
        spendingGet(token, sessions, connection, res);
    }
    post(
        token,
        sessions,
        connection,
        description,
        category_id,
        amount,
        date,
        res
    ) {
        spendingPost(
            token,
            sessions,
            connection,
            description,
            category_id,
            amount,
            date,
            res
        );
    }
}

module.exports = new spending();
