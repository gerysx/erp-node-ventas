const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/usuario.controller');
const { verificarToken, permitirRol } = require('../middlewares/auth.middleware');

router.get('/', verificarToken, permitirRol('ADMIN'), ctrl.listarUsuarios);
router.post('/', verificarToken, permitirRol('ADMIN'), ctrl.crearUsuario);
router.put('/:id', verificarToken, permitirRol('ADMIN'), ctrl.actualizarUsuario);
router.delete('/:id', verificarToken, permitirRol('ADMIN'), ctrl.eliminarUsuario);

module.exports = router;
