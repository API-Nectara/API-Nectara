import { Sequelize } from "sequelize";
import * as dotenv from "dotenv";

// 1. Cargar variables de entorno dependiendo del modo
const envFile = process.env.NODE_ENV === "test" ? ".env.test" : ".env.local";
dotenv.config({ path: envFile });

// 🛡️ Protección de seguridad
if (
  process.env.NODE_ENV === "test" &&
  !/test/i.test(process.env.DB_NAME)
) {
  throw new Error(
    "⚠️ Estás en modo test, pero la base de datos no contiene 'test' en el nombre. ¡Peligro de borrar datos reales!"
  );
}

// 2. Crear la conexión a la base de datos
const db_connection = new Sequelize(
  process.env.DB_NAME,     // nombre BD
  process.env.DB_USER,     // usuario BD
  process.env.DB_PASS,     // contraseña BD
  {
    host: process.env.DB_HOST,     // host BD
    dialect: process.env.DB_DIALECT, // tipo de BD (mysql)
    logging: false, // no mostrar logs SQL por consola
    define: {
      timestamps: false
    }
  }
);

export default db_connection;