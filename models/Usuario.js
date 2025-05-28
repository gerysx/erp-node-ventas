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
  tableName: 'usuarios' // 🔒 fuerza el nombre en minúscula y sin comillas dobles
});

module.exports = Usuario;
