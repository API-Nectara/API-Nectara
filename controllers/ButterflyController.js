import ButterflyModel from "../models/ButterflyModel.js";

export const getAllButterflies = async(req, res) => {
    try {
        const butterflies = await ButterflyModel.findAll()
        res.status(200).json(butterflies)
    } catch (error) {
        res.json({message: error.message})
    }
}
