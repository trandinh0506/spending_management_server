const { getCategories } = require("./getCategories");
const { updateCategories } = require("./updateCategories");
class categories {
    get(token, sessions, connection, res) {
        getCategories(token, sessions, connection, res);
    }
    update(token, sessions, connection, categories, res) {
        updateCategories(token, sessions, connection, categories, res);
    }
}

module.exports = new categories();
