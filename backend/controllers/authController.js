const pool = require('../db');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'cambialo_por_un_secreto';

// Registro
exports.register = async (req, res) => {
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
};

// Login
exports.login = async (req, res) => {
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
};
