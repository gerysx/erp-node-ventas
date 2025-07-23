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
  underscored: true 
});

module.exports = Proveedor;
