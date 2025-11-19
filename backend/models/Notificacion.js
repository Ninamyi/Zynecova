const mongoose = require("mongoose");

const notificacionSchema = new mongoose.Schema({
    usuario_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Usuario',
        required: true
    },
    tipo: {
        type: String,
        enum: ['alerta', 'reporte', 'actualizacion', 'sistema'],
        required: true
    },
    descripcion: {
        type: String,
        required: true
    },
    leida: {
        type: Boolean,
        default: false
    },
    fecha: {
        type: Date,
        default: Date.now
    }
}, {
    timestamps: true,
    versionKey: false
});

module.exports = mongoose.model("Notificacion", notificacionSchema);