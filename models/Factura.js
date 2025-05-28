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
    references: {
      model: 'clientes', // 👈 debe coincidir con tableName en Cliente.js
      key: 'id'
    }
  },
  empleadoId: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: 'empleados', // 👈 debe coincidir con tableName en Empleado.js
      key: 'id'
    }
  }
}, {
  tableName: 'facturas' // 👈 nombre fijo de tabla
});

// Relaciones
Factura.belongsTo(Cliente, { foreignKey: 'clienteId', as: 'cliente' });
Factura.belongsTo(Empleado, { foreignKey: 'empleadoId', as: 'empleado' });

module.exports = Factura;