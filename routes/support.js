const express = require("express");
const router = express.Router();

var controller = require("../controllers/support.controller");

// router.get("/:idUser/:idEmail", controller.index);
//router.get("/", controller.getAllEmail);
router.get("/", controller.list);
router.get("/:id", controller.info);
router.post("/", controller.postSupport);
router.post("/update/:id", controller.updateSupport);
router.post("/delete/:id", controller.deleteSupport);

module.exports = router;
