const { z } = require("zod");

const prisma = require("../prisma/client");
const { predictDiabetes } = require("../utils/predictDiabetes");

const predictionSchema = z.object({
  pregnancies: z.coerce.number().int().min(0),
  glucose: z.coerce.number().min(0),
  bloodPressure: z.coerce.number().min(0),
  skinThickness: z.coerce.number().min(0),
  insulin: z.coerce.number().min(0),
  bmi: z.coerce.number().min(0),
  diabetesPedigreeFunction: z.coerce.number().min(0),
  age: z.coerce.number().int().min(1),
});

async function predict(req, res, next) {
  try {
    const payload = predictionSchema.parse(req.body);
    const predictionResult = predictDiabetes(payload);

    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
      select: { id: true, consent: true },
    });

    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    if (user.consent !== true) {
      return res.status(200).json({
        ...payload,
        predictionResult,
        createdAt: new Date().toISOString(),
        saved: false,
      });
    }

    const record = await prisma.diabetesRecord.create({
      data: {
        userId: req.user.id,
        ...payload,
        predictionResult,
      },
    });

    return res.status(201).json({
      ...record,
      saved: true,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ message: error.issues[0]?.message || "Invalid prediction input." });
    }

    return next(error);
  }
}

async function getHistory(req, res, next) {
  try {
    const records = await prisma.diabetesRecord.findMany({
      where: { userId: req.user.id },
      orderBy: { createdAt: "desc" },
    });

    return res.json(records);
  } catch (error) {
    return next(error);
  }
}

async function getRecordById(req, res, next) {
  try {
    const id = Number(req.params.id);

    if (!Number.isInteger(id)) {
      return res.status(400).json({ message: "Invalid record id." });
    }

    const record = await prisma.diabetesRecord.findFirst({
      where: {
        id,
        userId: req.user.id,
      },
    });

    if (!record) {
      return res.status(404).json({ message: "Prediction record not found." });
    }

    return res.json(record);
  } catch (error) {
    return next(error);
  }
}

module.exports = {
  predict,
  getHistory,
  getRecordById,
};
