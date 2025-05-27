const Usuario = require('../models/Usuario');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Registrar usuario
exports.registrar = async (req, res) => {
  const { nombre, correo, password, rol } = req.body;

  try {
    const existe = await Usuario.findOne({ where: { correo } });
    if (existe) return res.status(400).json({ mensaje: 'El correo ya está registrado.' });

    const passwordHasheado = await bcrypt.hash(password, 10);

    const nuevoUsuario = await Usuario.create({
      nombre,
      correo,
      password: passwordHasheado,
      rol
    });

    res.status(201).json({ mensaje: 'Usuario creado correctamente', usuario: nuevoUsuario });
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al registrar usuario', error });
  }
};

// Login
exports.login = async (req, res) => {
  const { correo, password } = req.body;

  try {
    const usuario = await Usuario.findOne({ where: { correo } });
    if (!usuario) return res.status(404).json({ mensaje: 'Usuario no encontrado' });

    const passwordValido = await bcrypt.compare(password, usuario.password);
    if (!passwordValido) return res.status(401).json({ mensaje: 'Contraseña incorrecta' });

    const token = jwt.sign(
      { id: usuario.id, rol: usuario.rol },
      process.env.JWT_SECRET,
      { expiresIn: '4h' }
    );

    res.json({ mensaje: 'Login exitoso', token, usuario: { nombre: usuario.nombre, rol: usuario.rol } });
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al iniciar sesión', error });
  }
};
