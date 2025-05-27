const Producto = require('../models/Producto');

// Listar todos
exports.listar = async (req, res) => {
  const productos = await Producto.findAll();
  res.json(productos);
};

// Obtener por ID
exports.obtener = async (req, res) => {
  const producto = await Producto.findByPk(req.params.id);
  if (!producto) return res.status(404).json({ mensaje: 'Producto no encontrado' });
  res.json(producto);
};

// Crear
exports.crear = async (req, res) => {
  const { nombre, precio, stock, proveedorId } = req.body;

  if (!nombre || nombre.trim().length === 0) {
    return res.status(400).json({ mensaje: 'El nombre del producto es obligatorio.' });
  }

  if (isNaN(precio) || precio <= 0 || isNaN(stock) || stock < 0) {
    return res.status(400).json({ mensaje: 'Precio y stock deben ser valores numéricos positivos.' });
  }

  const proveedor = await require('../models/Proveedor').findByPk(proveedorId);
  if (!proveedor) {
    return res.status(400).json({ mensaje: 'Proveedor no válido' });
  }

  const nuevo = await Producto.create({ nombre, precio, stock, proveedorId });
  res.status(201).json(nuevo);
};



// Actualizar
exports.actualizar = async (req, res) => {
  const producto = await Producto.findByPk(req.params.id);
  if (!producto) return res.status(404).json({ mensaje: 'Producto no encontrado' });
  await producto.update(req.body);
  res.json(producto);
};

// Eliminar
exports.eliminar = async (req, res) => {
  const producto = await Producto.findByPk(req.params.id);
  if (!producto) return res.status(404).json({ mensaje: 'Producto no encontrado' });
  await producto.destroy();
  res.json({ mensaje: 'Producto eliminado' });
};
