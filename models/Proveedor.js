const { DataTypes } = require('sequelize');
const db = require('../config/db');

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
  tableName: 'proveedores',   // Nombre exacto en la DB
  freezeTableName: true,      // ✅ Evita que Sequelize lo pluralice automáticamente
  timestamps: true,
  createdAt: 'created_at',    // ✅ Formato en la DB
  updatedAt: 'updated_at'
});

module.exports = Proveedor;

