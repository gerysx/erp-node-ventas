const { QueryTypes } = require('sequelize');
const db = require('../config/db');

exports.ventasPorMes = async (req, res) => {
  try {
    const resultados = await db.query(`
      SELECT 
        DATE_FORMAT(f.fecha, '%Y-%m') AS mes,
        SUM(d.cantidad * d.precioUnitario) AS total
      FROM Facturas f
      JOIN DetalleFacturas d ON d.facturaId = f.id
      GROUP BY mes
      ORDER BY mes DESC
    `, { type: QueryTypes.SELECT });

    res.json(resultados);
  } catch (error) {
    console.error('Error en reporte:', error);
    res.status(500).json({ mensaje: 'Error al generar el reporte', error });
  }
};

exports.facturasPorCliente = async (req, res) => {
  const { clienteId } = req.params;

  try {
    const resultados = await db.query(`
      SELECT 
        f.id,
        f.fecha,
        e.nombre AS empleado,
        SUM(d.cantidad * d.precioUnitario) AS total
      FROM Facturas f
      JOIN Empleados e ON f.empleadoId = e.id
      JOIN DetalleFacturas d ON d.facturaId = f.id
      WHERE f.clienteId = ?
      GROUP BY f.id, f.fecha, empleado
      ORDER BY f.fecha DESC
    `, {
      type: db.QueryTypes.SELECT,
      replacements: [clienteId]
    });

    res.json(resultados);
  } catch (error) {
    console.error('Error reporte por cliente:', error);
    res.status(500).json({ mensaje: 'Error al generar el reporte', error });
  }
};

