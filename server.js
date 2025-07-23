// 1. Importaciones principales
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const dotenv = require('dotenv');

// 2. Cargar variables de entorno
dotenv.config();

// 3. Conexión a la base de datos
const db = require('./config/db');

// 4. Cargar modelos
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

// 5. Inicializar la app
const app = express();

// 6. Middlewares globales
app.use(helmet()); // Seguridad básica
app.use(morgan('dev')); // Logs HTTP

// ✅ Configuración CORS
app.use(cors({
  origin: 'https://erp-ventas-frontend.onrender.com',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());

// 7. Rutas
app.use('/api/auth', require('./routes/auth.routes'));
app.use('/api/productos', require('./routes/producto.routes'));
app.use('/api/clientes', require('./routes/cliente.routes'));
app.use('/api/empleados', require('./routes/empleado.routes'));
app.use('/api/proveedores', require('./routes/proveedor.routes'));
app.use('/api/facturas', require('./routes/factura.routes'));
app.use('/api/reportes', require('./routes/reporte.routes'));
app.use('/api/usuarios', require('./routes/usuario.routes'));

// 8. Ruta básica para test
app.get('/', (req, res) => {
  res.json({ message: '✅ API ERP funcionando correctamente' });
});

// 9. Puerto dinámico
const PORT = process.env.PORT || 3000;

// 10. Conectar DB y arrancar servidor
db.sync()
  .then(() => {
    console.log('✅ Base de datos conectada');
    app.listen(PORT, () => {
      console.log(`🚀 Servidor activo en puerto ${PORT}`);
    });
  })
  .catch(err => {
    console.error('❌ Error al conectar la BD:', err);
  });
