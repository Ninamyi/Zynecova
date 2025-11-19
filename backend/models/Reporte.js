const mongoose = require("mongoose");

const reporteSchema = new mongoose.Schema({
  usuario_id: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: "Usuario",
    required: true
  },
  zona_id: { 
    type: String,
    required: true,
    trim: true
  },
  descripcion: {
    type: String,
    required: true,
    trim: true
  },
  tipo: { 
    type: String,
    enum: ["Técnico", "Reemplazo", "Revisión", "Incidente", "Otro"],
    default: "Incidente"
  }, 
  fecha: { 
    type: Date, 
    default: Date.now 
  },
  imagen: { 
    type: String, 
    default: "" 
  }, 
  video: { 
    type: String, 
    default: "" 
  }, 
  estado: { 
    type: String, 
    enum: ["pendiente", "en proceso", "cerrado"],
    default: "pendiente" 
  },
  alerta_relacionada: {
    type: String,
    default: null
  }
},
{ versionKey: false }
);

module.exports = mongoose.model("Reporte", reporteSchema);