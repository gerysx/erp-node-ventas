const { DataTypes } = require('sequelize');
const db = require('../config/db');

const Proveedor = db.define('Proveedor', {
  nombre: {
    type: DataTypes.STRING,
    allowNull: false
  },
  contacto: {
    type: DataTypes.STRING,
    allowNull: true
  }
});

module.exports = Proveedor;
