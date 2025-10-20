const express = require("express");
const router = express.Router();
const { getDatosCiudad } = require("../controllers/mapaController");

router.get("/", getDatosCiudad);

module.exports = router;
