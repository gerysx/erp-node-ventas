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
    references: {
      model: 'proveedores', // 👈 nombre fijo y correcto del modelo relacionado
      key: 'id'
    }
  }
}, {
  tableName: 'productos' // 👈 nombre fijo para evitar errores y pluralizaciones raras
});

// Asociación después de definir el modelo
Producto.belongsTo(Proveedor, {
  foreignKey: 'proveedorId',
  as: 'proveedor'
});

module.exports = Producto;
