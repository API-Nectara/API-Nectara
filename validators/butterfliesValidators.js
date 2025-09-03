import { body } from "express-validator";

export const createButterflyValidator = [

body('common_name').trim().notEmpty().withMessage('El nombre común es obligatorio'),
body('scientific_name').trim().notEmpty().withMessage('El nombre científico es obligatorio'),
body('location').trim().notEmpty().withMessage('La localización es obligatoria'),
body('description').trim().isLength({ min: 10 }).withMessage('La descripción debe tener al menos 10 caracteres'),
body('habitat').trim().notEmpty().withMessage('El hábitat es obligatorio'),
body('image').trim().isURL().withMessage('La imagen debe ser una URL válida'),
body('migratory').isBoolean().withMessage('Migratory debe ser true o false').toBoolean(),
]; 
