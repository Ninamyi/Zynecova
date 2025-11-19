const { ObjectId } = require("mongodb");
const { connectMongoDB } = require("../connectionMongoDB");
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

exports.crearNoticia = async (req, res) => {
    if (!db) return res.status(503).json({ message: "Servicio de base de datos no disponible." });

    try {
        const nuevaNoticia = req.body; 
        
        if (!nuevaNoticia.fecha) nuevaNoticia.fecha = new Date();
        if (!nuevaNoticia.estado) nuevaNoticia.estado = "pendiente";

        const resultado = await db.collection("noticias").insertOne(nuevaNoticia);
        
        if (resultado.acknowledged) {
            return res.status(201).json({ message: "Noticia creada con éxito.", id: resultado.insertedId });
        } else {
            throw new Error("Fallo al insertar en la base de datos.");
        }

    } catch (error) {
        console.error('Error al crear noticia:', error);
        res.status(500).json({ message: "Error interno al crear la noticia." });
    }
};

exports.actualizarNoticia = async (req, res) => {
    if (!db) return res.status(503).json({ message: "Servicio de base de datos no disponible." });

    try {
        const { id } = req.params;
        const datosActualizados = req.body;

        const result = await db.collection("noticias").updateOne(
            { _id: new ObjectId(id) }, 
            { $set: datosActualizados }
        );

        if (result.matchedCount === 0) {
            return res.status(404).json({ message: "Noticia no encontrada para actualizar." });
        }

        res.json({ message: "Noticia actualizada con éxito." });

    } catch (error) {
        console.error('Error al actualizar noticia:', error);
        res.status(400).json({ message: "ID o datos inválidos para la actualización." });
    }
};