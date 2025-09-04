import ButterflyModel from "../models/ButterflyModel.js";

export const getAllButterflies = async (req, res) => {
    try {
        const butterflies = await ButterflyModel.findAll()
        res.status(200).json(butterflies)
    } catch (error) {
        res.json({ message: error.message })
    }
}
export const getOneButterfly = async (req, res) => {
    try {
        const { id } = req.params;
        const butterfly = await ButterflyModel.findByPk(id);

        if (!butterfly) {
            return res.status(404).json({ error: "Butterfly no found" });
        }
        res.json(butterfly)

    } catch (error) {
        console.error("getOneButterfly error:", error);
        res.status(500).json({ error: "Error obteniendo butterfly" });

    }
};
export const deleteButterfly = async (req, res) => {
    try {
        const butterfly = await ButterflyModel.destroy({ where: { id: req.params.id } });
        res.status(200).json({ message: "The butterfly has been deleted successfully!" });
    } catch (error) {
        res.json({ message: error.message });
    }

};
export const createButterfly = async (req, res) => {
    try {
        const { common_name, scientific_name, location, description, habitat, image, migratory } = req.body;
        const newButterfly = await ButterflyModel.create({
            common_name,
            scientific_name,
            location,
            description,
            habitat,
            image,
            migratory
        });
        res.status(201).json({
            message: "Mariposa creada correctamente",
            data: newButterfly,
            id: newButterfly.id
        });
    } catch (error) {
        console.error("createButterfly error:", error);
        res.status(500).json({ error: "Error creando mariposa" });
    }
};
export const updateButterfly = async (req, res) => {
    try {
        const { id } = req.params;
        const butterfly = await ButterflyModel.findByPk(id);// Buscamos la mariposa por su id

        if (!butterfly) {
      return res.status(404).json({ error: "Butterfly no encontrada" });
    }
    //Tomamos los datos del body ya validados
     const { common_name, scientific_name, location, description, habitat, image, migratory } = req.body;
     //Actualizamos los campos
     butterfly.common_name = common_name;
     butterfly.scientific_name = scientific_name;
     butterfly.location = location;
     butterfly.description = description;
     butterfly.habitat = habitat;
     butterfly.image = image;
     butterfly.migratory = migratory;

     await butterfly.save();// los guardamos en BD.
     return res.status(200).json({
        message: "Mariposa actualizada correctamente",
        data: butterfly 
        
    });
        
    } catch (error) {
        console.error("updateButterfly error:", error);
        return res.status(500).json({ error: "Error actualizando mariposa" });
    }
};
