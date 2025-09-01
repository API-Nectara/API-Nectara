import express from "express"
import { getAllButterflies} from "../controllers/ButterflyController.js"

const butterflyRouter= express.Router()

butterflyRouter.get("/", getAllButterflies)

export default butterflyRouter
