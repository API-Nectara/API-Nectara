import { DataTypes } from "sequelize";
import db_connection from "../database/db_connection.js";

const ButterflyModel = db_connection.define('butterflies', {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true, // 👈 le dice a MySQL que se incremente solo
      primaryKey: true,    // 👈 clave primaria
    },
   
    common_name: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: {
          msg: "especificar common_name",
        },
        len: {
          args: [2, 255], // mínimo 2, máximo 255 caracteres
          msg: "el campo common_name no permite menos de 2 caracteres",
        },
      },
    },
    scientific_name: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: {
          msg: "este campo no puede estar vacío",
        },
        len: {
          args: [2, 255],
          msg: "este campo no permite menos de 2 caracteres",
        },
      },
    },
    location: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: {
          msg: "este campo no puede estar vacío",
        },
        len: {
          args: [2, 255],
          msg: "este campo no permite menos de 2 caracteres",
        },
      },
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: false,
      validate: {
        notNull: {
          msg: "este campo no puede estar vacío",
        },
        len: {
          args: [10, 10000], // mínimo 10 caracteres
          msg: "este campo no permite menos de 10 caracteres",
        },
      },
    },
    habitat: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: {
          msg: "este campo no puede estar vacío",
        },
        len: {
          args: [2, 255],
          msg: "este campo no permite menos de 2 caracteres",
        },
      },
    },
    image: {
      type: DataTypes.TEXT,
      allowNull: false,
      validate: {
        notNull: {
          msg: "este campo no puede estar vacío",
        },
        len: {
          args: [5, 10000], // mínimo 5 caracteres (ej: URL)
          msg: "este campo no permite menos de 5 caracteres",
        },
        // Si quieres forzar que sea una URL, descomenta esto:
        // isUrl: { msg: "el campo image debe ser una URL válida" }
      },
    },
    migratory: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false, // mejor poner default
      validate: {
        notNull: {
          msg: "este campo no puede estar vacío",
        },
      },
    },
  },
  {
    timestamps: false,
    tableName: "butterflies", // fija el nombre real de la tabla
    freezeTableName: true, // evita pluralizaciones automáticas
  }
);
export default ButterflyModel






