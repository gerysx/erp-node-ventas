const { DataTypes } = require('sequelize');
const db = require('../config/db');
const Cliente = require('./Cliente');
const Empleado = require('./Empleado');

const Factura = db.define('Factura', {
  fecha: {
    type: DataTypes.DATEONLY,
    allowNull: false
  }
});

Factura.belongsTo(Cliente, { foreignKey: 'clienteId', as: 'cliente' });
Factura.belongsTo(Empleado, { foreignKey: 'empleadoId', as: 'empleado' });

module.exports = Factura;
