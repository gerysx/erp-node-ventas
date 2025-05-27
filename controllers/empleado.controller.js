const Empleado = require('../models/Empleado');

exports.listar = async (req, res) => {
  const empleados = await Empleado.findAll();
  res.json(empleados);
};

exports.obtener = async (req, res) => {
  const empleado = await Empleado.findByPk(req.params.id);
  if (!empleado) return res.status(404).json({ mensaje: 'Empleado no encontrado' });
  res.json(empleado);
};

exports.crear = async (req, res) => {
  const { nombre, correo, telefono } = req.body;

  if (!nombre || nombre.length < 2) {
    return res.status(400).json({ mensaje: 'Nombre inválido' });
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!correo || !emailRegex.test(correo)) {
    return res.status(400).json({ mensaje: 'Correo no válido' });
  }

  const existente = await Empleado.findOne({ where: { correo } });
  if (existente) {
    return res.status(400).json({ mensaje: 'El correo ya está registrado' });
  }

  const nuevo = await Empleado.create({ nombre, correo, telefono });
  res.status(201).json(nuevo);
};


exports.actualizar = async (req, res) => {
  const empleado = await Empleado.findByPk(req.params.id);
  if (!empleado) return res.status(404).json({ mensaje: 'Empleado no encontrado' });
  await empleado.update(req.body);
  res.json(empleado);
};

exports.eliminar = async (req, res) => {
  const empleado = await Empleado.findByPk(req.params.id);
  if (!empleado) return res.status(404).json({ mensaje: 'Empleado no encontrado' });
  await empleado.destroy();
  res.json({ mensaje: 'Empleado eliminado' });
};
