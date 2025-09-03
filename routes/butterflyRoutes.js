import express from "express"
import { getAllButterflies, deleteButterfly, getOneButterfly } from "../controllers/ButterflyController.js"


const butterflyRouter= express.Router()

butterflyRouter.get("/", getAllButterflies)
butterflyRouter.get("/:id", getOneButterfly)
butterflyRouter.delete("/:id", deleteButterfly)


export default butterflyRouter