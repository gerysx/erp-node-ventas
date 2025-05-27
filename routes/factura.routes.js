const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/factura.controller');
const { verificarToken, permitirRol } = require('../middlewares/auth.middleware');

router.get('/', verificarToken, ctrl.listar);
router.get('/:id', verificarToken, ctrl.obtener);
router.post('/', verificarToken, permitirRol('ADMIN', 'EMPLEADO'), ctrl.crear);
router.get('/:id/pdf', verificarToken, permitirRol('ADMIN', 'EMPLEADO'), ctrl.descargarPDF);


router.get('/ventas', ctrl.ventas);
router.get('/ventas/producto/:productoId', ctrl.ventasPorProducto);

module.exports = router;
