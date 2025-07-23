const { DataTypes } = require('sequelize');
const db = require('../config/db');

const Empleado = db.define('empleado', {
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
}, {
  tableName: 'empleados',
  timestamps: true,
  createdAt: 'createdat',
  updatedAt: 'updatedat' 
});

module.exports = Empleado;
