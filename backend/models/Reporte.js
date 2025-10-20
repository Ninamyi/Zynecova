const mongoose = require("mongoose");

const reporteSchema = new mongoose.Schema({
  usuario_id: { type: mongoose.Schema.Types.ObjectId, ref: "Usuario" },
  ciudad: String,
  descripcion: String,
  tipo: String, 
  fecha: { type: Date, default: Date.now },
  imagen: String, 
  video: String, 
  estado: { type: String, default: "pendiente" }
});

module.exports = mongoose.model("Reporte", reporteSchema);
