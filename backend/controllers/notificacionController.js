const { ObjectId } = require("mongodb");
const { connectMongoDB } = require("../connectionMongoDB");
const Notificacion = require('../models/notificacion');

let db;

(async () => {
  try {
    db = await connectMongoDB();
    console.log("Conexión a MongoDB establecida para el controlador de noticias.");
  } catch (error) {
    console.error("Error al conectar a MongoDB en el controlador de noticias:", error);
  }
})();

exports.getNoticiasDatosAmbientales = async (req, res) => {
    if (!db) return res.status(503).json({ message: "Servicio de base de datos no disponible." });

    try {
        const datos = await db.collection("datos_ambientales").find({ 
            estado: { $in: ["verde", "amarillo"] } 
        }).sort({ fecha: -1 }).limit(10).toArray();
        
        const noticiasMapeadas = datos.map(d => ({
            titulo: `[DATOS] Reporte Ambiental en ${d.ciudad}`,
            contenido: d.incidente ? d.incidente : `**Temp:** ${d.temperatura}°C, **Humedad:** ${d.humedad}%, **Aire:** ${d.calidad_aire}.`,
            fecha: d.fecha,
            imagen: d.imagen, 
            fuente: "Base de Datos Principal"
        }));

        res.json(noticiasMapeadas);
    } catch (error) {
        console.error('Error al obtener datos ambientales de MongoDB:', error);
        res.status(500).json({ message: "Error al obtener datos principales" });
    }
};

exports.getAlertasCriticas = async (req, res) => {
    if (!db) return res.status(503).json({ message: "Servicio de base de datos no disponible." });

    try {
        const alertas = await db.collection("alertas").find({ 
            nivel_alerta: { $in: ["Alto", "Crítico"] },
            estado: "Activa"
        }).sort({ fecha_generacion: -1 }).limit(5).toArray();
        
        const alertasMapeadas = alertas.map(a => ({
            tipo_alerta: `${a.tipo_alerta.toUpperCase()} (NIVEL ${a.nivel_alerta.toUpperCase()})`,
            descripcion: a.descripcion,
            nivel: a.nivel_alerta.toUpperCase(),
            fecha_alerta: a.fecha_generacion,
            fuente: "Base de Datos Secundaria"
        }));

        res.json(alertasMapeadas);
    } catch (error) {
        console.error('Error al obtener alertas de MongoDB:', error);
        res.status(500).json({ message: "Error al obtener alertas" });
    }
};

exports.getDatosExternos = async (req, res) => {
    const query = "últimas noticias de contaminación y cambio climático en Latinoamérica"; 
    
    try {
        const response = await google.search({ queries: [query] });

        let datosExternos = [];
        if (response.result) {
            const results = JSON.parse(response.result).results;
            
            datosExternos = results.slice(0, 5).map(item => ({ 
                title: item.source_title || item.snippet.substring(0, 50) + '...',
                summary: item.snippet,
                published_at: item.publication_time ? new Date(item.publication_time).toISOString() : new Date().toISOString(),
                content: item.snippet, 
                image_url: null 
            }));
        }

        res.json(datosExternos);
    } catch (error) {
        console.error('Error en la búsqueda dinámica de Google:', error);
        res.json([]);
    }
};

exports.getNoticiasAdmin = async (req, res) => {
    if (!db) return res.status(503).json({ message: "Servicio de base de datos no disponible." });

    try {
        const noticias = await db.collection("noticias").find().sort({ fecha: -1 }).toArray();
        res.json(noticias);
    } catch (error) {
        console.error('Error al obtener noticias para Admin:', error);
        res.status(500).json({ message: "Error interno al obtener el listado de noticias." });
    }
};

exports.crearNotificacion = async (req, res) => {
    try {
        const { usuario_id, tipo, descripcion } = req.body;
        
        const nuevaNotificacion = new Notificacion({
            usuario_id,
            tipo,
            descripcion
        });

        const notificacionGuardada = await nuevaNotificacion.save();

        res.status(201).json({ 
            message: "Notificación creada con éxito.",
            notificacion: notificacionGuardada
        });
    } catch (error) {
        console.error('Error al crear notificación:', error);
        res.status(400).json({ message: "Error al crear la notificación. Datos inválidos." });
    }
};

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

