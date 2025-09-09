import "dotenv/config"; // carga .env.* según tu setup
import express from "express";
import butterflyRouter from "./routes/butterflyRoutes.js";
import db_connection from "./database/db_connection.js";
import ButterflyModel from "./models/ButterflyModel.js";
import cors from "cors";




export const app = express();
// Middlewares
app.use(cors({ origin: "http://localhost:5173" })); // puerto de Vite
app.use(express.json());

// Rutas
app.get("/health", (_req, res) => res.json({ ok: true }));
app.get("/", (_req, res) => res.send("Hola API"));
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