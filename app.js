import "dotenv/config";// carga .env.local
import express from "express";
import db_connection from "./database/db_connection.js";
import butterflyRoutes from "./routes/butterflyRoutes.js";
import ButterflyModel from "./models/ButterflyModel.js";

export const app = express()
app.get("/", (req, res) => {
    res.send("Hola API")
 })

 app.use (express.json())
 app.use("/butterflies", butterflyRoutes)


 try {
    await db_connection.authenticate()
    console.log('conected to database🚀')
    await ButterflyModel.sync()
    console.log('Modelo sincronizado correctamente')
 } catch (error) {
     console.log(`error:' ${error}`)
 }
 export const server = app.listen(process.env.PORT || 8000, () => {
  console.log(`🚀 Server up in http://localhost:${process.env.PORT || 8000}/`);
});