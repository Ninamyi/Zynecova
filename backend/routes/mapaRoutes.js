const express = require("express");
const router = express.Router();
const { getDatosCiudad } = require("../controllers/mapaController");
const authenticateToken = require("../middlewares/authMiddleware");

router.get("/", authenticateToken, getDatosCiudad);

module.exports = router;
