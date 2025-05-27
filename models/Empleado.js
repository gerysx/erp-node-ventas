const { DataTypes } = require('sequelize');
const db = require('../config/db');

const Empleado = db.define('Empleado', {
  nombre: {
    type: DataTypes.STRING,
    allowNull: false
  },
  correo: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },
  telefono: {
    type: DataTypes.STRING,
    allowNull: true
  }
});

module.exports = Empleado;
