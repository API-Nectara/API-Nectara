import express from "express"
import { getAllButterflies, deleteButterfly, getOneButterfly, createButterfly, updateButterfly } from "../controllers/ButterflyController.js"
import { validationResult } from "express-validator"
import { createButterflyValidator, updateButterflyValidator } from "../validators/butterfliesValidators.js"

const butterflyRouter = express.Router()
butterflyRouter.use((req, res, next) => {
  console.log("ROUTER →", req.method, req.originalUrl);
  next();
});

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

butterflyRouter.put("/:id", updateButterflyValidator, (req, res, next) => {
  console.log('→ Llega al PUT con id:', req.params.id);
  const errors = validationResult(req);

  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
  updateButterfly(req, res, next);
})
console.log("📌 Rutas cargadas en butterflies:");// para ver si carga todas las rutas GET/POST/PUT/DELETE
butterflyRouter.stack.forEach(r => {
  if (r.route && r.route.path) {
    console.log(Object.keys(r.route.methods).join(",").toUpperCase(), r.route.path);
  }
});


export default butterflyRouter;