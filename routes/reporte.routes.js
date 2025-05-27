const express = require('express');
const router = express.Router();
const { ventasPorMes, facturasPorCliente } = require('../controllers/reporte.controller');
const { verificarToken, permitirRol } = require('../middlewares/auth.middleware');

// Reporte 1: Ventas por mes (solo ADMIN)
router.get('/ventas-por-mes', verificarToken, permitirRol('ADMIN'), ventasPorMes);

// Reporte 2: Facturas por cliente (ADMIN y EMPLEADO)
router.get('/facturas-por-cliente/:clienteId', verificarToken, permitirRol('ADMIN', 'EMPLEADO'), facturasPorCliente);

module.exports = router;
