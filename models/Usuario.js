const { DataTypes } = require('sequelize');
const db = require('../config/db'); // tu instancia Sequelize

const Usuario = db.define('usuario', {
  nombre: {
    type: DataTypes.STRING,
    allowNull: false
  },
  correo: {
    type: DataTypes.STRING,
    unique: true,
    allowNull: false
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false
  },
  rol: {
    type: DataTypes.ENUM('ADMIN', 'EMPLEADO'),
    allowNull: false
  }
}, {
  tableName: 'usuarios',
  freezeTableName: true,
  timestamps: true,
  createdAt: 'createdat',
  updatedAt: 'updatedat'
});

module.exports = Usuario;
