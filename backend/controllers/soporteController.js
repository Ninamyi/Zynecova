const pool = require('../db');

// Obtener reportes soporte
exports.getSoporte = async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM reportes_soporte ORDER BY fecha DESC');
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al obtener reportes de soporte' });
  }
};

// Crear reporte soporte
exports.createSoporte = async (req, res) => {
  try {
    const { tipo, descripcion } = req.body;
    const fecha = new Date();
    const estado = 'Pendiente';
    const [result] = await pool.query(
      'INSERT INTO reportes_soporte (tipo, descripcion, fecha, estado) VALUES (?, ?, ?, ?)',
      [tipo, descripcion, fecha, estado]
    );
    res.json({ status: 'success', id: result.insertId });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al crear reporte soporte' });
  }
};

// Actualizar estado
exports.updateSoporte = async (req, res) => {
  try {
    const { id } = req.params;
    const { estado } = req.body;
    await pool.query('UPDATE reportes_soporte SET estado = ? WHERE id = ?', [estado, id]);
    res.json({ status: 'success' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al actualizar estado' });
  }
};

// Eliminar reporte soporte
exports.deleteSoporte = async (req, res) => {
  try {
    const { id } = req.params;
    await pool.query('DELETE FROM reportes_soporte WHERE id = ?', [id]);
    res.json({ status: 'success' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al eliminar reporte' });
  }
};
