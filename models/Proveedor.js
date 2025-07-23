const { DataTypes } = require('sequelize');
const db = require('../config/db');

const Proveedor = db.define('proveedor', {
  nombre: {
    type: DataTypes.STRING,
    allowNull: false
  },
  contacto: {
    type: DataTypes.STRING,
    allowNull: true
  }
}, {
  tableName: 'proveedores',
  timestamps: true,
  createdAt: 'created_at', 
  updatedAt: 'updated_at'
});

module.exports = Proveedor;
