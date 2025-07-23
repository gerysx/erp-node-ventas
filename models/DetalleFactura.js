const { DataTypes } = require('sequelize');
const db = require('../config/db');
const Factura = require('./Factura');
const Producto = require('./Producto');

const DetalleFactura = db.define('detallefactura', {
  cantidad: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  precioUnitario: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
    field: 'preciounitario',
  },
  facturaId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    field: 'facturaid',
    references: {
      model: 'facturas', // 👈 debe coincidir con tableName de Factura
      key: 'id'
    }
  },
  productoId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    field: 'productoid',
    references: {
      model: 'productos', // 👈 debe coincidir con tableName de Producto
      key: 'id'
    }
  }
}, {
  tableName: 'detallefacturas',
  freezeTableName: true,
  timestamps: true,
  createdAt: 'createdat',
  updatedAt: 'updatedat'
});



module.exports = DetalleFactura;
