import ButterflyModel from "../models/ButterflyModel.js";

export const getAllButterflies = async(req, res) => {
    try {
        const butterflies = await ButterflyModel.findAll()
        res.status(200).json(butterflies)
    } catch (error) {
        res.json({message: error.message})
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