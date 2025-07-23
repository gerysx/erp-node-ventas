const { DataTypes } = require('sequelize');
const db = require('../config/db');
const Proveedor = require('./Proveedor');

const Producto = db.define('producto', {
  nombre: {
    type: DataTypes.STRING,
    allowNull: false
  },
  precio: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false
  },
  stock: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  descripcion: {
    type: DataTypes.TEXT
  },
  proveedorId: {
    type: DataTypes.INTEGER,
    allowNull: true,
    field: 'proveedorid', 
    references: {
      model: 'proveedores',
      key: 'id'
    }
  }
}, {
  tableName: 'productos',
  timestamps: true,
  createdAt: 'createdat', 
  updatedAt: 'updatedat'
});

Producto.belongsTo(Proveedor, {
  foreignKey: 'proveedorId',
  as: 'proveedor'
});

module.exports = Producto;
