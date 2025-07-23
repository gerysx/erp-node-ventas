exports.ventasPorMes = async (req, res) => {
  try {
    const resultados = await db.query(`
      SELECT 
        TO_CHAR(f.fecha, 'YYYY-MM') AS mes,
        SUM(d.cantidad * d.preciounitario) AS total
      FROM facturas f
      JOIN detallefacturas d ON d.facturaid = f.id
      GROUP BY mes
      ORDER BY mes DESC
    `, { type: QueryTypes.SELECT });

    res.json(resultados);
  } catch (error) {
    console.error('❌ Error en reporte:', error);
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
        SUM(d.cantidad * d.preciounitario) AS total
      FROM facturas f
      JOIN empleados e ON f.empleadoid = e.id
      JOIN detallefacturas d ON d.facturaid = f.id
      WHERE f.clienteid = $1
      GROUP BY f.id, f.fecha, empleado
      ORDER BY f.fecha DESC
    `, {
      type: QueryTypes.SELECT,
      bind: [clienteId]
    });

    res.json(resultados);
  } catch (error) {
    console.error('❌ Error reporte por cliente:', error);
    res.status(500).json({ mensaje: 'Error al generar el reporte', error });
  }
};
