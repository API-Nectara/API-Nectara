import { Sequelize } from "sequelize";
import dotenv from "dotenv"; dotenv.config({ path: '.env.local' });

const db_connection = new Sequelize(
        process.env.DB_NAME,
        process.env.DB_USER,
        process.env.DB_PASS,
        {
            host: 'localhost',
            dialect: 'mysql', 
            define: { 
                timestamps: false
        }

        });
        
        export default db_connection;