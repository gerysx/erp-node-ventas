const { DataTypes } = require('sequelize');
const db = require('../config/db');

const Usuario = db.define('Usuario', {
  nombre: {
    type: DataTypes.STRING,
    allowNull: false
  },
  correo: {
    type: DataTypes.STRING,
    unique: true,
    allowNull: false
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false
  },
  rol: {
    type: DataTypes.ENUM('ADMIN', 'EMPLEADO'),
    allowNull: false
  }
});

module.exports = Usuario;
