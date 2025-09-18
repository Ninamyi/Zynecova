// server.js
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const pool = require('./db');

const app = express();
app.use(cors());
app.use(express.json());

const JWT_SECRET = process.env.JWT_SECRET || 'cambialo_por_un_secreto';

// Middleware para verificar token
function authenticateToken(req, res, next) {
  const auth = req.headers['authorization'];
  if (!auth) return res.status(401).json({ error: 'No autorizado' });
  const token = auth.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'No autorizado' });

  try {
    const payload = jwt.verify(token, JWT_SECRET);
    req.user = payload;
    next();
  } catch (err) {
    return res.status(401).json({ error: 'Token inválido' });
  }
}

/* - AUTH (register / login) - */

// Registro
app.post('/api/auth/register', async (req, res) => {
  try {
    const { nombre, email, password, rol = 'usuario' } = req.body;
    if (!nombre || !email || !password) return res.status(400).json({ error: 'Faltan datos' });

    const [rows] = await pool.query('SELECT id FROM usuarios WHERE email = ?', [email]);
    if (rows.length) return res.status(400).json({ error: 'Correo ya registrado' });

    const hash = await bcrypt.hash(password, 10);
    const [result] = await pool.query(
      'INSERT INTO usuarios (nombre, email, password, rol) VALUES (?, ?, ?, ?)',
      [nombre, email, hash, rol]
    );

    res.json({ status: 'success', id: result.insertId });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error en servidor' });
  }
});

// Login
app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ error: 'Faltan datos' });

    const [rows] = await pool.query('SELECT id, nombre, email, password, rol FROM usuarios WHERE email = ?', [email]);
    if (!rows.length) return res.status(400).json({ error: 'Usuario no encontrado' });

    const user = rows[0];
    const ok = await bcrypt.compare(password, user.password);
    if (!ok) return res.status(400).json({ error: 'Credenciales inválidas' });

    const token = jwt.sign({ id: user.id, nombre: user.nombre, email: user.email, rol: user.rol }, JWT_SECRET, { expiresIn: '8h' });
    res.json({ status: 'success', token, nombre: user.nombre, rol: user.rol, id: user.id });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error en servidor' });
  }
});

/* - REPORTES USUARIOS - */
// Obtener todos (admin) o propios
app.get('/api/reportes', authenticateToken, async (req, res) => {
  try {
    // si es admin devuelve todos, si no devuelve solo del usuario
    if (req.user.rol === 'administrador') {
      const [rows] = await pool.query('SELECT r.*, u.nombre as usuario_nombre FROM reportes_ambientales r LEFT JOIN usuarios u ON r.usuario_id = u.id ORDER BY r.fecha DESC');
      return res.json(rows);
    } else {
      const [rows] = await pool.query('SELECT r.*, u.nombre as usuario_nombre FROM reportes_ambientales r LEFT JOIN usuarios u ON r.usuario_id = u.id WHERE r.usuario_id = ? ORDER BY r.fecha DESC', [req.user.id]);
      return res.json(rows);
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al obtener reportes' });
  }
});

// Crear reporte usuario (token requerido)
app.post('/api/reportes', authenticateToken, async (req, res) => {
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
});

/* - PRONOSTICOS (empleados) - */
app.get('/api/pronosticos', authenticateToken, async (req, res) => {
  try {
    // admin ve todo, empleado filtra por empleado si quieres
    const [rows] = await pool.query('SELECT p.*, u.nombre as empleado_nombre FROM pronosticos p LEFT JOIN usuarios u ON p.empleado_id = u.id ORDER BY p.fecha DESC');
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al obtener pronósticos' });
  }
});

app.post('/api/pronosticos', authenticateToken, async (req, res) => {
  try {
    const { ciudad, fecha, temperatura, precipitacion, nivel_agua, calidad_agua, calidad_aire, incidente, estado_riesgo } = req.body;
    const empleado_id = req.user.id; // se asume empleado
    await pool.query(
      `INSERT INTO pronosticos (empleado_id, ciudad, fecha, temperatura, precipitacion, nivel_agua, calidad_agua, calidad_aire, incidente, estado_riesgo)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [empleado_id, fecha, temperatura, precipitacion, nivel_agua, calidad_agua, calidad_aire, incidente || null, estado_riesgo]
    );
    res.json({ status: 'success' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al guardar pronóstico' });
  }
});

/* - SOPORTE - */
app.get('/api/soporte', authenticateToken, async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM reportes_soporte ORDER BY fecha DESC');
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al obtener reportes de soporte' });
  }
});

app.post('/api/soporte', authenticateToken, async (req, res) => {
  try {
    const { tipo, descripcion } = req.body;
    const fecha = new Date();
    const estado = 'Pendiente';
    const [result] = await pool.query('INSERT INTO reportes_soporte (tipo, descripcion, fecha, estado) VALUES (?, ?, ?, ?)', [tipo, descripcion, fecha, estado]);
    res.json({ status: 'success', id: result.insertId });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al crear reporte soporte' });
  }
});

app.put('/api/soporte/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const { estado } = req.body;
    await pool.query('UPDATE reportes_soporte SET estado = ? WHERE id = ?', [estado, id]);
    res.json({ status: 'success' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al actualizar estado' });
  }
});

app.delete('/api/soporte/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    await pool.query('DELETE FROM reportes_soporte WHERE id = ?', [id]);
    res.json({ status: 'success' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al eliminar reporte' });
  }
});

/* - ADMIN (registros_admin) - */
app.get('/api/admin', authenticateToken, async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM registros_admin ORDER BY fecha DESC');
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al obtener registros admin' });
  }
});

app.post('/api/admin', authenticateToken, async (req, res) => {
  try {
    const { nombre, rol, detalle, fecha } = req.body;
    const [result] = await pool.query('INSERT INTO registros_admin (nombre, rol, detalle, fecha) VALUES (?, ?, ?, ?)', [nombre, rol, detalle, fecha]);
    res.json({ status: 'success', id: result.insertId });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al crear registro admin' });
  }
});

app.put('/api/admin/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const { nombre, detalle } = req.body;
    await pool.query('UPDATE registros_admin SET nombre = ?, detalle = ? WHERE id = ?', [nombre, detalle, id]);
    res.json({ status: 'success' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al editar registro admin' });
  }
});

app.delete('/api/admin/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    await pool.query('DELETE FROM registros_admin WHERE id = ?', [id]);
    res.json({ status: 'success' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al eliminar registro admin' });
  }
});

/* - Levantar servidor - */
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Backend corriendo en http://localhost:${PORT}`);
});
