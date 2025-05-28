// 1. Importaciones principales
const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

// 2. Cargar variables de entorno lo antes posible
dotenv.config(); // DEBE IR AQUÍ

// 3. Conexión a la base de datos
const db = require('./config/db');

// 4. Cargar modelos (para que Sequelize los registre)
require('./models/Usuario');
require('./models/Producto');
require('./models/Cliente');
require('./models/Empleado');
require('./models/Proveedor');
const Factura = require('./models/Factura');
const DetalleFactura = require('./models/DetalleFactura');
const Producto = require('./models/Producto');

// Asociaciones
Factura.hasMany(DetalleFactura, { foreignKey: 'facturaId', as: 'detalles' });
DetalleFactura.belongsTo(Factura, { foreignKey: 'facturaId', as: 'factura' });
DetalleFactura.belongsTo(Producto, { foreignKey: 'productoId', as: 'producto' });


// 5. Inicializar la app
const app = express();

// 6. Middlewares
const corsOptions = {
  origin: 'https://erp-ventas-frontend.onrender.com', // Tu frontend
  credentials: true, // Si usas cookies o auth headers
};

app.use(cors(corsOptions));
app.use(express.json());

// 7. Rutas
const authRoutes = require('./routes/auth.routes');
app.use('/api/auth', authRoutes);

const productoRoutes = require('./routes/producto.routes');
app.use('/api/productos', productoRoutes);

const clienteRoutes = require('./routes/cliente.routes');
app.use('/api/clientes', clienteRoutes);

const empleadoRoutes = require('./routes/empleado.routes');
app.use('/api/empleados', empleadoRoutes);

const proveedorRoutes = require('./routes/proveedor.routes');
app.use('/api/proveedores', proveedorRoutes);

const facturaRoutes = require('./routes/factura.routes');
app.use('/api/facturas', facturaRoutes);

const reporteRoutes = require('./routes/reporte.routes');
app.use('/api/reportes', reporteRoutes);

const usuarioRoutes = require('./routes/usuario.routes');
app.use('/api/usuarios', usuarioRoutes);


// 8. Sincronizar base de datos y arrancar servidor
const PORT = process.env.PORT || 3000;

db.sync().then(() => {
  console.log('✅ Base de datos conectada');
  app.listen(PORT, () => {
    console.log(`🚀 Servidor activo en http://localhost:${PORT}`);
  });
}).catch((err) => {
  console.error('❌ Error al conectar la BD:', err);
});
"// trigger redeploy" 
