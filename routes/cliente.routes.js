const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/cliente.controller');
const { verificarToken, permitirRol } = require('../middlewares/auth.middleware');

// Usuarios autenticados pueden ver
router.get('/', verificarToken, ctrl.listar);
router.get('/:id', verificarToken, ctrl.obtener);

// Solo ADMIN puede modificar
router.post('/', verificarToken, permitirRol('ADMIN'), ctrl.crear);
router.put('/:id', verificarToken, permitirRol('ADMIN'), ctrl.actualizar);
router.delete('/:id', verificarToken, permitirRol('ADMIN'), ctrl.eliminar);

module.exports = router;
