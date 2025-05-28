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
    allowNull: false
  },
  facturaId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'facturas', // 👈 debe coincidir con tableName de Factura
      key: 'id'
    }
  },
  productoId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'productos', // 👈 debe coincidir con tableName de Producto
      key: 'id'
    }
  }
}, {
  tableName: 'detallefacturas'
});

// Relaciones
DetalleFactura.belongsTo(Factura, { foreignKey: 'facturaId', as: 'factura' });
DetalleFactura.belongsTo(Producto, { foreignKey: 'productoId', as: 'producto' });

module.exports = DetalleFactura;
