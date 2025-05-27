const { DataTypes } = require('sequelize');
const db = require('../config/db');

const Cliente = db.define('Cliente', {
  nombre: {
    type: DataTypes.STRING,
    allowNull: false
  },
  correo: {
    type: DataTypes.STRING,
    allowNull: true
  },
  telefono: {
    type: DataTypes.STRING,
    allowNull: true
  }
});

module.exports = Cliente;
