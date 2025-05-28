const { DataTypes } = require('sequelize');
const db = require('../config/db'); // instancia de Sequelize

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
  tableName: 'proveedores' // 👈 nombre fijo, plural y en minúscula
});

module.exports = Proveedor;
