const express = require("express");
const router = express.Router();
const noticiaController = require("../controllers/noticiaController"); 

router.get("/noticias", noticiaController.getNoticiasDatosAmbientales); 
router.get("/alertas", noticiaController.getAlertasCriticas);
router.get("/datos-externos", noticiaController.getDatosExternos);

module.exports = router;