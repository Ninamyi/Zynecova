const Notificacion = require('../models/Notificacion'); 

exports.getNotificacionesByUsuario = async (req, res) => {
    try {
        const { usuarioId } = req.params;
        const notificaciones = await Notificacion.find({ usuario_id: usuarioId })
            .sort({ fecha: -1 });

        res.json(notificaciones);
    } catch (error) {
        console.error('Error al obtener notificaciones:', error);
        res.status(500).json({ message: "Error interno al obtener notificaciones." });
    }
};

exports.marcarComoLeida = async (req, res) => {
    try {
        const { id } = req.params;
        
        const result = await Notificacion.findByIdAndUpdate(
            id, 
            { leida: true }, 
            { new: true } 
        );

        if (!result) {
            return res.status(404).json({ message: "Notificación no encontrada." });
        }

        res.json({ message: "Notificación marcada como leída.", notificacion: result });
    } catch (error) {
        console.error('Error al marcar como leída:', error);
        res.status(500).json({ message: "Error interno al actualizar la notificación." });
    }
};

exports.getConteoNoLeidas = async (req, res) => {
    try {
        const { usuarioId } = req.params;
        
        const count = await Notificacion.countDocuments({ 
            usuario_id: usuarioId, 
            leida: false 
        });

        res.json({ conteo: count });
    } catch (error) {
        console.error('Error al obtener conteo:', error);
        res.status(500).json({ message: "Error interno al obtener el conteo." });
    }
};