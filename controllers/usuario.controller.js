const Usuario = require('../models/Usuario');
const bcrypt = require('bcrypt');

exports.crearUsuario = async (req, res) => {
  const { nombre, correo, password, rol } = req.body;

  if (!nombre || !correo || !password || !rol) {
    return res.status(400).json({ mensaje: 'Todos los campos son obligatorios' });
  }

  try {
    const existente = await Usuario.findOne({ where: { correo } });
    if (existente) {
      return res.status(400).json({ mensaje: 'Ya existe un usuario con ese correo' });
    }

    const hash = await bcrypt.hash(password, 10);

    const nuevoUsuario = await Usuario.create({
      nombre,
      correo,
      password: hash,
      rol
    });

    res.status(201).json({ mensaje: 'Usuario creado correctamente', id: nuevoUsuario.id });
  } catch (error) {
    console.error(error);
    res.status(500).json({ mensaje: 'Error al crear usuario' });
  }
};

exports.listarUsuarios = async (req, res) => {
  try {
    const usuarios = await Usuario.findAll({ attributes: { exclude: ['password'] } });
    res.json(usuarios);
  } catch (error) {
    console.error(error);
    res.status(500).json({ mensaje: 'Error al listar usuarios' });
  }
};

exports.actualizarUsuario = async (req, res) => {
  const { id } = req.params;
  const { nombre, correo, password, rol } = req.body;

  try {
    const usuario = await Usuario.findByPk(id);
    if (!usuario) return res.status(404).json({ mensaje: 'Usuario no encontrado' });

    usuario.nombre = nombre;
    usuario.correo = correo;
    usuario.rol = rol;

    if (password) {
      const hash = await bcrypt.hash(password, 10);
      usuario.password = hash;
    }

    await usuario.save();
    res.json({ mensaje: 'Usuario actualizado' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ mensaje: 'Error al actualizar usuario' });
  }
};

exports.eliminarUsuario = async (req, res) => {
  const { id } = req.params;

  try {
    const usuario = await Usuario.findByPk(id);
    if (!usuario) return res.status(404).json({ mensaje: 'Usuario no encontrado' });

    await usuario.destroy();
    res.json({ mensaje: 'Usuario eliminado' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ mensaje: 'Error al eliminar usuario' });
  }
};
