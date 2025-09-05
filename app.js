// import "dotenv/config";// carga .env.local
// import express from 'express'
// import butterflyRouter from './routes/butterflyRoutes.js'
// import db_connection from './database/db_connection.js'
// import ButterflyModel from './models/ButterflyModel.js'

// export const app = express()

// app.get("/", (req, res) => {
//     res.send("Hola API")
// })

// app.use(express.json())
// app.use("/butterflies", butterflyRouter)

// try {
//     await db_connection.authenticate() //cada vez que levantamos node app.js
//     console.log('conected to database🐱‍🚀')
//     await ButterflyModel.sync()
//     console.log('models syncronised✔')
// } catch (error) {
//     console.log(`error: ${error}`)
// }

// export const server = app.listen(process.env.PORT || 8000, () => {
//   console.log(`🚀 Server up in http://localhost:${process.env.PORT || 8000}/`);
// });

import "dotenv/config"; // carga .env.* según tu setup
import express from "express";
import butterflyRouter from "./routes/butterflyRoutes.js";
import db_connection from "./database/db_connection.js";
import ButterflyModel from "./models/ButterflyModel.js";

export const app = express();

// Rutas y middlewares
app.get("/", (_req, res) => res.send("Hola API"));
app.use(express.json());
app.use("/butterflies", butterflyRouter);

// En tests NO levantamos servidor ni tocamos la DB aquí.
// Supertest usa directamente app y los tests hacen authenticate/sync en beforeAll.
let server = null;

if (process.env.NODE_ENV !== "test") {
  (async () => {
    try {
      await db_connection.authenticate();
      console.log("connected to database 🐱‍🚀");

      // Ajusta según tu equipo: { alter: true } o { force: false }
      await ButterflyModel.sync();
      console.log("models synchronised ✔");
    } catch (error) {
      console.error("DB error:", error);
    }

    const PORT = process.env.PORT || 8000;
    server = app.listen(PORT, () => {
    console.log(`🚀 Server up at http://localhost:${PORT}/`);
    });
  })();
}

export { server };