const mongoose = require("mongoose");

const alertaSchema = new mongoose.Schema(
  {
    zona_id: {
      type: String,
      required: true,
      trim: true
    },
    tipo_alerta: {
      type: String,
      required: true,
      trim: true,
      enum: ["Incendio", "Inundación", "Deslizamiento", "Contaminación", "Otros"]
    },
    descripcion: {
      type: String,
      required: true,
      trim: true
    },
    nivel_alerta: {
      type: String,
      required: true,
      enum: ["Bajo", "Moderado", "Alto", "Crítico"]
    },
    fecha_generacion: {
      type: Date,
      default: Date.now
    },
    estado: {
      type: String,
      required: true,
      enum: ["Activa", "Inactiva", "Cerrada"],
      default: "Activa"
    }
  },
  { versionKey: false }
);

module.exports = mongoose.model("Alerta", alertaSchema);