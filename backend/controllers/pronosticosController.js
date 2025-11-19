const pool = require('../db/db');

exports.getPronosticos = async (req, res) => {
  try {
    const [rows] = await pool.query(
      'SELECT p.*, u.nombre as empleado_nombre FROM pronosticos p LEFT JOIN usuarios u ON p.empleado_id = u.id ORDER BY p.fecha DESC'
    );
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al obtener pronósticos' });
  }
};

exports.createPronostico = async (req, res) => {
  try {
    const { ciudad, fecha, temperatura, precipitacion, nivel_agua, calidad_agua, calidad_aire, incidente, estado_riesgo } = req.body;
    const empleado_id = req.user.id;

    await pool.query(
      `INSERT INTO pronosticos (empleado_id, ciudad, fecha, temperatura, precipitacion, nivel_agua, calidad_agua, calidad_aire, incidente, estado_riesgo)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [empleado_id, ciudad, fecha, temperatura, precipitacion, nivel_agua, calidad_agua, calidad_aire, incidente || null, estado_riesgo]
    );

    res.json({ status: 'success' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al guardar pronóstico' });
  }
};
