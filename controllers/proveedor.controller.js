const Proveedor = require('../models/Proveedor');

exports.listar = async (req, res) => {
  const datos = await Proveedor.findAll();
  res.json(datos);
};

exports.obtener = async (req, res) => {
  const p = await Proveedor.findByPk(req.params.id);
  if (!p) return res.status(404).json({ mensaje: 'Proveedor no encontrado' });
  res.json(p);
};

exports.crear = async (req, res) => {
  const { nombre, contacto } = req.body;

  if (!nombre || nombre.length < 2) {
    return res.status(400).json({ mensaje: 'Nombre de proveedor inválido' });
  }

  const nuevo = await Proveedor.create({ nombre, contacto });
  res.status(201).json(nuevo);
};


exports.actualizar = async (req, res) => {
  const p = await Proveedor.findByPk(req.params.id);
  if (!p) return res.status(404).json({ mensaje: 'Proveedor no encontrado' });
  await p.update(req.body);
  res.json(p);
};

exports.eliminar = async (req, res) => {
  const p = await Proveedor.findByPk(req.params.id);
  if (!p) return res.status(404).json({ mensaje: 'Proveedor no encontrado' });
  await p.destroy();
  res.json({ mensaje: 'Proveedor eliminado' });
};
