const express = require("express");

const router = express.Router();
const authControllers = require("../controllers/authControllers");
const utilsControllers = require("../controllers/utilsControllers");

router
  .route("/per/:item_line")
  .get(
    authControllers.protect,
    authControllers.isUserInCompany,
    authControllers.restrictTo("User", "Admin"),
    utilsControllers.getPer
  );

module.exports = router;
