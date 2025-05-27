const jwt = require('jsonwebtoken');

exports.verificarToken = (req, res, next) => {
  const header = req.headers['authorization'];
  const token = header && header.split(' ')[1];

  if (!token) return res.status(403).json({ mensaje: 'Token requerido' });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.usuario = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ mensaje: 'Token inválido o expirado' });
  }
};

exports.permitirRol = (...rolesPermitidos) => {
  return (req, res, next) => {
    if (!rolesPermitidos.includes(req.usuario.rol)) {
      return res.status(403).json({ mensaje: 'Acceso denegado: rol insuficiente' });
    }
    next();
  };
};
