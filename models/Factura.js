const { DataTypes } = require('sequelize');
const db = require('../config/db');
const Cliente = require('./Cliente');
const Empleado = require('./Empleado');

const Factura = db.define('factura', {
  fecha: {
    type: DataTypes.DATEONLY,
    allowNull: false
  },
  clienteId: {
    type: DataTypes.INTEGER,
    allowNull: true,
    field: 'clienteid',
    references: {
      model: 'clientes', // 👈 debe coincidir con tableName en Cliente.js
      key: 'id'
    }
  },
  empleadoId: {
    type: DataTypes.INTEGER,
    allowNull: true,
    field: 'empleadoid',
    references: {
      model: 'empleados', // 👈 debe coincidir con tableName en Empleado.js
      key: 'id'
    }
  }
}, {
  tableName: 'facturas',
  freezeTableName: true,
  timestamps: true,
  createdAt: 'createdat',
  updatedAt: 'updatedat'
});



module.exports = Factura;