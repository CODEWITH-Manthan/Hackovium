/**
 * Enode Controller
 */

const enodeService = require("../services/enodeService");

exports.getActualData = async (req, res) => {
  try {
    const { predictedOutput } = req.query;
    const data = await enodeService.getInverterData(Number(predictedOutput) || 0);
    return res.json(data);
  } catch (err) {
    return res.status(500).json({ error: "Failed to fetch inverter data." });
  }
};
