const { DataTypes } = require('sequelize');
const db = require('../config/db');

const Cliente = db.define('cliente', {
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
}, {
  tableName: 'clientes',
  timestamps: true,
  createdAt: 'createdat',
  updatedAt: 'updatedat'
});

module.exports = Cliente;
