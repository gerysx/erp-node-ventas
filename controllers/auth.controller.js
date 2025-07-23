const Usuario = require('../models/Usuario');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Registrar usuario
exports.registrar = async (req, res) => {
  const { nombre, correo, password, rol } = req.body;

  if (!nombre || !correo || !password || !rol) {
    return res.status(400).json({ mensaje: 'Todos los campos son obligatorios' });
  }

  try {
    const existe = await Usuario.findOne({ where: { correo } });
    if (existe) {
      return res.status(400).json({ mensaje: 'El correo ya está registrado.' });
    }

    const passwordHasheado = await bcrypt.hash(password, 10);

    const nuevoUsuario = await Usuario.create({
      nombre,
      correo,
      password: passwordHasheado,
      rol
    });

    res.status(201).json({ mensaje: 'Usuario creado correctamente', usuario: nuevoUsuario });
  } catch (error) {
    console.error('🔥 Error en registrar:', error);
    res.status(500).json({ mensaje: 'Error al registrar usuario' });
  }
};

// Login
exports.login = async (req, res) => {
  const { correo, password } = req.body;

  if (!correo || !password) {
    return res.status(400).json({ mensaje: 'Correo y contraseña son obligatorios' });
  }

  try {
    const usuario = await Usuario.findOne({ where: { correo } });
    if (!usuario) {
      return res.status(404).json({ mensaje: 'Usuario no encontrado' });
    }

    const passwordValido = await bcrypt.compare(password, usuario.password);
    if (!passwordValido) {
      return res.status(401).json({ mensaje: 'Contraseña incorrecta' });
    }

    if (!process.env.JWT_SECRET) {
      console.error('❌ JWT_SECRET no definido en el entorno');
      return res.status(500).json({ mensaje: 'Error en configuración del token' });
    }

    const token = jwt.sign(
      { id: usuario.id, rol: usuario.rol, correo: usuario.correo },
      process.env.JWT_SECRET,
      { expiresIn: '4h' }
    );

    res.json({
      mensaje: 'Login exitoso',
      token,
      usuario: { nombre: usuario.nombre, rol: usuario.rol }
    });
  } catch (error) {
    console.error('🔥 Error en login:', error);
    res.status(500).json({ mensaje: 'Error al iniciar sesión' });
  }
};
