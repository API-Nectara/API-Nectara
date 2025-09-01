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
    scientific_name: {

        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            notNull: {
                msg: 'este campo no puede estar vacío'
            },
            len: {
                min: 2,
                msg: 'este campo no permite menos de 2 caracteres'
            }
        }
    },

    location: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            notNull: {
                msg: 'este campo no puede estar vacío'
            },
            len: {
                min: 2,
                msg: 'este campo no permite menos de 2 caracteres'
            }
        }
    },
    description: {
        type: DataTypes.TEXT,
        allowNull: false,
        validate: {
            notNull: {
                msg: 'este campo no puede estar vacío'
            },
            min: {
                args: 10,
                msg: 'este campo no permite menos de 10 caracterés'
            }
        }
    },
    habitat: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            notNull: {
                msg: 'este campo no puede estar vacío'
            },
            len: {
                min: 2,
                msg: 'este campo no permite menos de 2 caracteres'
            }
        }
    },
    image: {
        type: DataTypes.TEXT,
        allowNull: false,
        validate: {
            notNull: {
                msg: 'este campo no puede estar vacío'
            },
            min: {
                args: 10,
                msg: 'este campo no permite menos de 10 caracterés'
            }
        }
    },
    migratory:{
        type: DataTypes.BOOLEAN,
        allowNull: false,
        validate: {
            notNull: {
                msg: 'este campo no puede estar vacío'
            },            
        }
    },

}, {
    timestamps: false
});
export default ButterflyModel
    
    



        
