const { Sequelize } = require('sequelize');
const dotenv = require('dotenv');
dotenv.config();

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    dialect: 'postgres',
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false
      }
    },
    logging: false,
    define: {
      freezeTableName: true,   // evita nombres en plural automáticos
      underscored: true,       // convierte camelCase -> snake_case (opcional)
      timestamps: true         // crea created_at y updated_at automáticamente
    }
  }
);

module.exports = sequelize;
