import express from "express"
import { getAllButterflies, deleteButterfly, getOneButterfly, createButterfly } from "../controllers/ButterflyController.js"
import { validationResult } from "express-validator"
import { createButterflyValidator } from "../validators/butterfliesValidators.js"

const butterflyRouter= express.Router()

butterflyRouter.get("/", getAllButterflies)
butterflyRouter.get("/:id", getOneButterfly)
butterflyRouter.delete("/:id", deleteButterfly)
butterflyRouter.post("/", createButterflyValidator, (req, res, next) => {

    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    // si no hay errores se llama al controlador
    createButterfly(req, res, next);

});