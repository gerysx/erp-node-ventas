const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/proveedor.controller');
const { verificarToken, permitirRol } = require('../middlewares/auth.middleware');

router.get('/', verificarToken, ctrl.listar);
router.get('/:id', verificarToken, ctrl.obtener);
router.post('/', verificarToken, permitirRol('ADMIN'), ctrl.crear);
router.put('/:id', verificarToken, permitirRol('ADMIN'), ctrl.actualizar);
router.delete('/:id', verificarToken, permitirRol('ADMIN'), ctrl.eliminar);

module.exports = router;
