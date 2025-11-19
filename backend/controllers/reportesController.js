const pool = require('../db/db');

exports.getReportes = async (req, res) => {
  try {
    if (req.user.rol === 'administrador') {
      const [rows] = await pool.query(
        'SELECT r.*, u.nombre as usuario_nombre FROM reportes_ambientales r LEFT JOIN usuarios u ON r.usuario_id = u.id ORDER BY r.fecha DESC'
      );
      return res.json(rows);
    } else {
      const [rows] = await pool.query(
        'SELECT r.*, u.nombre as usuario_nombre FROM reportes_ambientales r LEFT JOIN usuarios u ON r.usuario_id = u.id WHERE r.usuario_id = ? ORDER BY r.fecha DESC',
        [req.user.id]
      );
      return res.json(rows);
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al obtener reportes' });
  }
};

exports.createReporte = async (req, res) => {
  try {
    const { ciudad, descripcion, tipo_incidente, archivo } = req.body;
    const usuario_id = req.user.id;
    const fecha = new Date();

    await pool.query(
      'INSERT INTO reportes_ambientales (usuario_id, ciudad, descripcion, tipo_incidente, archivo, fecha) VALUES (?, ?, ?, ?, ?, ?)',
      [usuario_id, ciudad, descripcion, tipo_incidente, archivo || null, fecha]
    );

    res.json({ status: 'success' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al crear reporte' });
  }
};
