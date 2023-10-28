const express = require("express");
const router = express.Router();

const usersController = require("../controllers/UsersController");

router.post("/login", usersController.login);
router.post("/register", usersController.register);
router.post("/add", usersController.add);
router.post("/update", usersController.update);
router.get("/categories", usersController.categories);
router.get("/spendings/get", usersController.getSpending);
module.exports = router;
