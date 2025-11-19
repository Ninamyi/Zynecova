const pool = require('../db/db');

exports.getAdmin = async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM registros_admin ORDER BY fecha DESC');
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al obtener registros admin' });
  }
};

exports.createAdmin = async (req, res) => {
  try {
    const { nombre, rol, detalle, fecha } = req.body;
    const [result] = await pool.query(
      'INSERT INTO registros_admin (nombre, rol, detalle, fecha) VALUES (?, ?, ?, ?)',
      [nombre, rol, detalle, fecha]
    );
    res.json({ status: 'success', id: result.insertId });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al crear registro admin' });
  }
};

exports.updateAdmin = async (req, res) => {
  try {
    const { id } = req.params;
    const { nombre, detalle } = req.body;
    await pool.query('UPDATE registros_admin SET nombre = ?, detalle = ? WHERE id = ?', [nombre, detalle, id]);
    res.json({ status: 'success' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al editar registro admin' });
  }
};

exports.deleteAdmin = async (req, res) => {
  try {
    const { id } = req.params;
    await pool.query('DELETE FROM registros_admin WHERE id = ?', [id]);
    res.json({ status: 'success' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al eliminar registro admin' });
  }
};
