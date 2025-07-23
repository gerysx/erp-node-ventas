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
    field: 'proveedorid', // Nombre real en la DB
    references: {
      model: 'proveedores', //  Tabla correcta
      key: 'id'
    }
  }
}, {
  tableName: 'productos',     // Nombre exacto en la DB
  freezeTableName: true,      //  Evita pluralización errónea
  timestamps: true,
  createdAt: 'createdat',     //  Sin guión bajo (como está en tu DB)
  updatedAt: 'updatedat'
});



module.exports = Producto;
