const { ObjectId } = require("mongodb");
const { connectMongoDB } = require("../config/connectionMongoDB");

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