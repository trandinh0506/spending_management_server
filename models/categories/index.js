const { getCategories } = require("./getCategories");
class categories {
    get(token, sessions, connection, res) {
        getCategories(token, sessions, connection, res);
    }
}

module.exports = new categories();
