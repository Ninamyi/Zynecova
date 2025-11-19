const mongoose = require("mongoose");

const datoAmbientalSchema = new mongoose.Schema(
  {
    ciudad: {
      type: String,
      required: true,
      trim: true
    },
    fecha: {
      type: Date,
      default: Date.now
    },
    temperatura: {
      type: Number,
      required: true
    },
    humedad: {
        type: Number,
        required: true,
        min: 0,
        max: 100
    },
      calidad_aire: { 
      type: Number, 
      required: true,
      min: 0,
      max: 500
    },
    calidad_agua: { 
      type: Number, 
      required: true,
      min: 0,
      max: 100
    },
    precipitacion: {
      type: Number, 
      default: 0
    },
    nivel_agua: { 
      type: Number, 
      default: 0
    },
    estado: { 
      type: String,
      enum: ["verde", "amarillo", "naranja", "rojo"], 
      required: true
    },
    riesgo: {
      type: Boolean,
      default: false
    },
    incidente: {
      type: String,
      trim: true,
      default: ""
    },
    usuario_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Usuario", 
    }
  },
  { versionKey: false }
);

module.exports = mongoose.model("DatoAmbiental", datoAmbientalSchema);