const { DataTypes } = require('sequelize');
const db = require('../config/db');

const DetalleFactura = db.define('DetalleFactura', {
  cantidad: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  precioUnitario: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false
  }
});

module.exports = DetalleFactura;
