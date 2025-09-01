import { DataTypes } from "sequelize";
import db_connection from "../database/db_connection.js";

const ButterflyModel = db_connection.define('butterflies', {
    common_name: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            notNull: {// significa que este campo tiene que rellenarse siempre
                msg: 'especificar common-name'
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
                msg: 'especificar scientific_name'
            },
            len: {
                min: 2,
                msg: 'el campo scientific-name no permite menos de 2 caracteres'
            },
        }

    },
    location: {
        type: DataTypes.STRING,
        allowNull: false,// permitimos que no exista signifca allowNull si ponemos true le decimos que no es obligatorio poner ese campo
        validate: {
            notNull: {
                msg: 'especificar location'
            },
            len: {
                min: 2,
                msg: 'el campo location no permite menos de 2 caracteres'
            }
        }

    },
    description: {
        type: DataTypes.TEXT,
        allowNull: false,
        validate: {
            notNull: {
                msg: 'especificar una descripcion'
            },
            min: {
                args: 10,
                msg: 'este campo no permite menos de 10 caracterés'
            }
        }

    },
    habitat: {
         type: DataTypes.STRING,
        allowNull: false,// permitimos que no exista signifca allowNull si ponemos true le decimos que no es obligatorio poner ese campo
        validate: {
            notNull: {
                msg: 'especificar habitat'
            },
            len: {
                min: 2,
                msg: 'el campo location no permite menos de 2 caracteres'
            }
        }

    },

    image: {
        type: DataTypes.TEXT,
        allowNull: false,
        validate: {
            notNull: {
                msg: 'especificar una descripcion'
            },
            min: {
                args: 10,
                msg: 'este campo no permite menos de 10 caracterés'
            }
        }

    }, 
    migratory: {
        type: DataTypes.BOOLEAN,
        allowNull: false,// permitimos que no exista signifca allowNull si ponemos true le decimos que no es obligatorio poner ese campo
        validate: {
            notNull: {
                msg: 'especificar habitat'
            },         
        }
    },

}, {
    timestamps: false 

});

export default ButterflyModel;