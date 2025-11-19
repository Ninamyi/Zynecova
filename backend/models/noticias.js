const mongoose = require("mongoose");

const noticiaSchema = new mongoose.Schema(
  {
    titulo: {
      type: String,
      required: true,
      trim: true
    },
    descripcion: {
      type: String,
      required: true,
      trim: true
    },
    autor: {
      type: String,
      default: "Equipo Zynecova",
      trim: true
    },
    categoria: {
      type: String,
      enum: ["clima", "agua", "energía", "reciclaje", "otros"],
      default: "otros"
    },
    fecha: {
      type: Date,
      default: Date.now
    },
    imagen: {
      type: String,
      default: ""
    }
  },
  { versionKey: false }
);

module.exports = mongoose.model("Noticia", noticiaSchema);