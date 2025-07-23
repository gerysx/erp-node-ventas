const Factura = require("../models/Factura");
const Cliente = require("../models/Cliente");
const Empleado = require("../models/Empleado");
const DetalleFactura = require("../models/DetalleFactura");
const Producto = require("../models/Producto");

const PDFDocument = require("pdfkit");
const fs = require("fs");
const path = require("path");
const { Sequelize } = require("sequelize");

const formatoEuro = new Intl.NumberFormat("es-ES", {
  style: "currency",
  currency: "EUR",
  minimumFractionDigits: 2,
});

/** ✅ LISTAR TODAS LAS FACTURAS CON TOTALES */
exports.listar = async (req, res) => {
  try {
    const facturas = await Factura.findAll({
      include: [
        { model: Cliente, as: "cliente", attributes: ["id", "nombre"] },
        { model: Empleado, as: "empleado", attributes: ["id", "nombre"] },
        {
          model: DetalleFactura,
          as: "detalles",
          attributes: ["cantidad", "precioUnitario"],
        },
      ],
      order: [["fecha", "DESC"]],
    });

    const resultado = facturas.map((f) => ({
      id: f.id,
      fecha: f.fecha,
      cliente: f.cliente,
      empleado: f.empleado,
      total: f.detalles.reduce(
        (acc, d) => acc + d.cantidad * parseFloat(d.precioUnitario),
        0
      ),
    }));

    res.json(resultado);
  } catch (error) {
    console.error("Error al listar facturas:", error);
    res.status(500).json({ mensaje: "Error al listar facturas" });
  }
};

/** ✅ OBTENER FACTURA DETALLADA */
exports.obtener = async (req, res) => {
  try {
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

    res.json(factura);
  } catch (error) {
    console.error("Error al obtener factura:", error);
    res.status(500).json({ mensaje: "Error al obtener factura" });
  }
};

/** ✅ CREAR FACTURA CON DETALLES Y DESCONTAR STOCK */
exports.crear = async (req, res) => {
  const t = await Factura.sequelize.transaction();
  try {
    const { clienteId, empleadoId, fecha, detalles } = req.body;

    if (!fecha || !Array.isArray(detalles) || detalles.length === 0) {
      return res
        .status(400)
        .json({ mensaje: "Debe incluir una fecha y al menos un producto" });
    }

    const cliente = await Cliente.findByPk(clienteId);
    if (!cliente) return res.status(400).json({ mensaje: "Cliente inválido" });

    const empleado = await Empleado.findByPk(empleadoId);
    if (!empleado)
      return res.status(400).json({ mensaje: "Empleado inválido" });

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

    const nuevaFactura = await Factura.create(
      { clienteId, empleadoId, fecha },
      { transaction: t }
    );

    for (let d of detalles) {
      await DetalleFactura.create(
        {
          facturaId: nuevaFactura.id,
          productoId: d.productoId,
          cantidad: d.cantidad,
          precioUnitario: d.precioUnitario,
        },
        { transaction: t }
      );

      const producto = await Producto.findByPk(d.productoId);
      producto.stock -= d.cantidad;
      await producto.save({ transaction: t });
    }

    await t.commit();
    res.status(201).json({ mensaje: "Factura creada", id: nuevaFactura.id });
  } catch (error) {
    await t.rollback();
    console.error("Error al crear factura:", error);
    res.status(500).json({ mensaje: "Error al crear factura" });
  }
};

/** ✅ DESCARGAR PDF */
exports.descargarPDF = async (req, res) => {
  try {
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

    if (fs.existsSync(logoPath)) {
      doc.image(logoPath, 50, 45, { width: 70 });
    }

    doc.fontSize(16).text("GAG Electric", 130, 50);
    doc.fontSize(10).text(`Factura Nº: ${factura.id}`, { align: "right" });
    doc.text(`Fecha: ${factura.fecha}`, { align: "right" });

    let totalNeto = 0;
    factura.detalles.forEach((d) => {
      totalNeto += d.cantidad * parseFloat(d.precioUnitario);
    });

    const iva = totalNeto * 0.21;
    const totalConIva = totalNeto + iva;

    doc.text(`Subtotal: ${formatoEuro.format(totalNeto)}`);
    doc.text(`IVA (21%): ${formatoEuro.format(iva)}`);
    doc.text(`TOTAL: ${formatoEuro.format(totalConIva)}`);

    doc.end();
  } catch (error) {
    console.error("Error al generar PDF:", error);
    res.status(500).json({ mensaje: "Error al generar PDF" });
  }
};

/** ✅ VENTAS GENERALES */
exports.ventas = async (req, res) => {
  try {
    const { clienteId, empleadoId } = req.query;
    const where = {};

    if (clienteId) where.clienteId = clienteId;
    if (empleadoId) where.empleadoId = empleadoId;

    const facturas = await Factura.findAll({
      where,
      include: [
        { model: Cliente, as: "cliente", attributes: ["id", "nombre"] },
        { model: Empleado, as: "empleado", attributes: ["id", "nombre"] },
        { model: DetalleFactura, as: "detalles", attributes: ["cantidad", "precioUnitario"] },
      ],
      order: [["fecha", "DESC"]],
    });

    const resultado = facturas.map((f) => {
      const total = f.detalles.reduce(
        (acc, d) => acc + d.cantidad * parseFloat(d.precioUnitario),
        0
      );
      return {
        id: f.id,
        fecha: f.fecha,
        total,
        cliente: f.cliente,
        empleado: f.empleado,
      };
    });

    res.json(resultado);
  } catch (err) {
    console.error(err);
    res.status(500).json({ mensaje: "Error al obtener ventas" });
  }
};

/** ✅ VENTAS POR PRODUCTO */
exports.ventasPorProducto = async (req, res) => {
  const { productoId } = req.params;

  if (!productoId) {
    return res.status(400).json({ mensaje: "Falta el ID del producto" });
  }

  try {
    const detalles = await DetalleFactura.findAll({
      where: { productoId: Number(productoId) },
      include: [{ model: Producto, as: "producto" }],
      order: [["createdat", "DESC"]],
    });

    const totalCantidad = detalles.reduce((sum, d) => sum + d.cantidad, 0);
    const totalVentas = detalles.reduce(
      (sum, d) => sum + d.cantidad * parseFloat(d.precioUnitario),
      0
    );

    res.json({
      producto: detalles[0]?.producto || null,
      totalCantidad,
      totalVentas,
      detalles,
    });
  } catch (error) {
    console.error("❌ Error en ventasPorProducto:", error);
    res.status(500).json({ mensaje: "Error al obtener ventas por producto" });
  }
};
