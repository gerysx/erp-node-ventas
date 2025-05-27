const Cliente = require('../models/Cliente');

exports.listar = async (req, res) => {
  const clientes = await Cliente.findAll();
  res.json(clientes);
};

exports.obtener = async (req, res) => {
  const cliente = await Cliente.findByPk(req.params.id);
  if (!cliente) return res.status(404).json({ mensaje: 'Cliente no encontrado' });
  res.json(cliente);
};

exports.crear = async (req, res) => {
  const { nombre, correo, telefono } = req.body;

  if (!nombre || nombre.length < 2) {
    return res.status(400).json({ mensaje: 'Nombre inválido' });
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (correo && !emailRegex.test(correo)) {
    return res.status(400).json({ mensaje: 'Correo no válido' });
  }

  const nuevo = await Cliente.create({ nombre, correo, telefono });
  res.status(201).json(nuevo);
};


exports.actualizar = async (req, res) => {
  const cliente = await Cliente.findByPk(req.params.id);
  if (!cliente) return res.status(404).json({ mensaje: 'Cliente no encontrado' });
  await cliente.update(req.body);
  res.json(cliente);
};

exports.eliminar = async (req, res) => {
  const cliente = await Cliente.findByPk(req.params.id);
  if (!cliente) return res.status(404).json({ mensaje: 'Cliente no encontrado' });
  await cliente.destroy();
  res.json({ mensaje: 'Cliente eliminado' });
};
