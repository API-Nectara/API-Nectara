import { DataTypes } from "sequelize";
import db_connection from "../database/db_connection.js";

const ButterflyModel = db_connection.define('butterflies', {

    common_name: { 

        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            notNull: {
                msg: 'especificar common_name'
            },
            len: {
                min: 2,
                msg: 'el campo common_name no permite menos de 2 caracteres'
            }
        }
    },
    scientific_name

    });


