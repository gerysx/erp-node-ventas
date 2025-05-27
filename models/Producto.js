const { DataTypes } = require('sequelize');
const db = require('../config/db');
const Proveedor = require('./Proveedor');

const Producto = db.define('Producto', {
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
    references: {
      model: 'Proveedors', // Sequelize pluraliza el nombre por defecto
      key: 'id'
    }
  }
});

// Asociación después de definir el modelo
Producto.belongsTo(Proveedor, {
  foreignKey: 'proveedorId',
  as: 'proveedor'
});

module.exports = Producto;
