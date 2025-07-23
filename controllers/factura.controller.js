const Factura = require("../models/Factura");
const Cliente = require("../models/Cliente");
const Empleado = require("../models/Empleado");
const DetalleFactura = require("../models/DetalleFactura");
const Producto = require("../models/Producto");

const PDFDocument = require("pdfkit");
const fs = require("fs");
const path = require("path");

const formatoEuro = new Intl.NumberFormat("es-ES", {
  style: "currency",
  currency: "EUR",
  minimumFractionDigits: 2,
});

exports.listar = async (req, res) => {
  const datos = await Factura.findAll({
    include: ["cliente", "empleado"],
  });
  res.json(datos);
};

exports.obtener = async (req, res) => {
  const factura = await Factura.findByPk(req.params.id, {
    include: [
      "cliente",
      "empleado",
      {
        model: DetalleFactura,
        include: ["producto"],
        as: "detalles",
      },
    ],
  });
  if (!factura)
    return res.status(404).json({ mensaje: "Factura no encontrada" });
  res.json(factura);
};

exports.crear = async (req, res) => {
  const { clienteId, empleadoId, fecha, detalles } = req.body;

  if (!fecha || !Array.isArray(detalles) || detalles.length === 0) {
    return res
      .status(400)
      .json({ mensaje: "Debe incluir una fecha y al menos un producto" });
  }

  const cliente = await Cliente.findByPk(clienteId);
  if (!cliente) return res.status(400).json({ mensaje: "Cliente inválido" });

  const empleado = await Empleado.findByPk(empleadoId);
  if (!empleado) return res.status(400).json({ mensaje: "Empleado inválido" });

  for (let d of detalles) {
    const producto = await Producto.findByPk(d.productoId);
    if (!producto) {
      return res
        .status(400)
        .json({ mensaje: `Producto ID ${d.productoId} no existe` });
    }

    if (
      producto.stock < d.cantidad ||
      d.cantidad <= 0 ||
      d.precioUnitario <= 0
    ) {
      return res.status(400).json({
        mensaje: `Stock insuficiente o datos inválidos para el producto ${producto.nombre}`,
      });
    }
  }

  const nuevaFactura = await Factura.create({ clienteId, empleadoId, fecha });

  for (let d of detalles) {
    await DetalleFactura.create({
      facturaId: nuevaFactura.id,
      productoId: d.productoId,
      cantidad: d.cantidad,
      precioUnitario: d.precioUnitario,
    });

    const producto = await Producto.findByPk(d.productoId);
    producto.stock -= d.cantidad;
    await producto.save();
  }

  res.status(201).json({ mensaje: "Factura creada", id: nuevaFactura.id });
};

exports.descargarPDF = async (req, res) => {
  const factura = await Factura.findByPk(req.params.id, {
    include: [
      { model: Cliente, as: "cliente" },
      { model: Empleado, as: "empleado" },
      {
        model: DetalleFactura,
        as: "detalles",
        include: [{ model: Producto, as: "producto" }],
      },
    ],
  });

  if (!factura)
    return res.status(404).json({ mensaje: "Factura no encontrada" });

  const doc = new PDFDocument({ margin: 50 });
  const logoPath = path.join(__dirname, "../public/images/logo.png");

  res.setHeader(
    "Content-Disposition",
    `attachment; filename=factura_${factura.id}.pdf`
  );
  res.setHeader("Content-Type", "application/pdf");
  doc.pipe(res);

  // Encabezado con logo
  if (fs.existsSync(logoPath)) {
    doc.image(logoPath, 50, 45, { width: 70 });
  }

  doc
    .fontSize(16)
    .font("Helvetica-Bold")
    .text("GAG Electric", 130, 50)
    .fontSize(10)
    .font("Helvetica")
    .text("CIF: B12345678", 130)
    .text("Puerta del Sol 1, Madrid", 130)
    .text("geralvarez@gag.es", 130);

  doc.moveDown(2);

  doc
    .fontSize(12)
    .text(`Factura Nº: ${factura.id}`, { align: "right" })
    .text(`Fecha: ${factura.fecha}`, { align: "right" })
    .text(`Cliente: ${factura.cliente?.nombre || "N/A"}`, { align: "right" })
    .text(`Empleado: ${factura.empleado?.nombre || "N/A"}`, { align: "right" });

  doc.moveDown(2);

  // Cabecera tabla
  const tableTop = doc.y;
  const col1 = 60,
    col2 = 240,
    col3 = 340,
    col4 = 440;

  doc
    .font("Helvetica-Bold")
    .fontSize(12)
    .text("Producto", col1, tableTop)
    .text("Cantidad", col2, tableTop)
    .text("Precio", col3, tableTop)
    .text("Subtotal", col4, tableTop);

  doc.moveDown(0.5);
  doc.moveTo(50, doc.y).lineTo(550, doc.y).stroke();
  doc.moveDown(0.5);
  doc.font("Helvetica");

  // Filas de productos
  let totalNeto = 0;
  let y = doc.y;

  factura.detalles.forEach((d) => {
    const precio = parseFloat(d.precioUnitario);
    const cantidad = parseInt(d.cantidad);
    const subtotal = cantidad * precio;
    totalNeto += subtotal;

    doc
      .text(d.producto.nombre, col1, y)
      .text(cantidad.toString(), col2, y, { width: 80, align: "right" })
      .text(formatoEuro.format(precio), col3, y, { width: 80, align: "right" })
      .text(formatoEuro.format(subtotal), col4, y, {
        width: 80,
        align: "right",
      });

    y += 20;
  });

  doc.moveTo(50, y).lineTo(550, y).stroke();
  y += 10;

  const iva = totalNeto * 0.21;
  const totalConIva = totalNeto + iva;

  doc.font("Helvetica-Bold");

  doc
    .text("Subtotal:", col3, y, { width: 80, align: "right" })
    .text(formatoEuro.format(totalNeto), col4, y, {
      width: 80,
      align: "right",
    });
  y += 20;

  doc
    .text("IVA (21%):", col3, y, { width: 80, align: "right" })
    .text(formatoEuro.format(iva), col4, y, {
      width: 80,
      align: "right",
    });
  y += 20;

  doc
    .fontSize(13)
    .text("TOTAL:", col3, y, { width: 80, align: "right" })
    .text(formatoEuro.format(totalConIva), col4, y, {
      width: 80,
      align: "right",
    });

  doc.end();
};

exports.ventas = async (req, res) => {
  try {
    const { clienteId, empleadoId } = req.query;

    const where = {};

    if (clienteId) where.clienteId = clienteId;
    if (empleadoId) where.empleadoId = empleadoId;

    const facturas = await Factura.findAll({
      where,
      include: [
        {
          model: Cliente,
          as: 'cliente',
          attributes: ['id', 'nombre']
        },
        {
          model: Empleado,
          as: 'empleado',
          attributes: ['id', 'nombre']
        }
      ],
      order: [['fecha', 'DESC']]
    });

    const resultado = facturas.map(f => ({
      id: f.id,
      fecha: f.fecha,
      total: f.detalles?.reduce((acc, d) => acc + d.cantidad * d.precioUnitario, 0) || 0,
      cliente: f.cliente,
      empleado: f.empleado
    }));

    res.json(resultado);
  } catch (err) {
    console.error(err);
    res.status(500).json({ mensaje: 'Error al obtener ventas' });
  }
};

exports.ventasPorProducto = async (req, res) => {
  const { productoId } = req.params;

  if (!productoId) {
    return res.status(400).json({ mensaje: 'Falta el ID del producto' });
  }

  try {
    const detalles = await DetalleFactura.findAll({
      where: { productoId: Number(productoId) }, // ✅ asegurar tipo numérico
      include: [
        {
          model: Producto,
          as: 'producto',
          attributes: [
            'id',
            'nombre',
            'precio',
            'stock',
            'descripcion',
            'proveedorId',
            'createdat',
            'updatedat'
          ]
        }
      ],
      order: [['createdat', 'DESC']] // ✅ usar el alias correcto
    });

    res.json(detalles);
  } catch (error) {
    console.error('❌ Error en ventasPorProducto:', error);
    res.status(500).json({ mensaje: 'Error al obtener ventas por producto' });
  }
};
