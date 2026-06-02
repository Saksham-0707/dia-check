const prisma = require("../prisma/client");

async function updateConsent(req, res, next) {
  try {
    const user = await prisma.user.update({
      where: { id: req.user.id },
      data: { consent: true },
    });

    return res.json({
      message: "Consent updated successfully.",
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        consent: user.consent,
        createdAt: user.createdAt,
      },
    });
  } catch (error) {
    console.error("Consent update failed.", error);
    return res.status(500).json({
      message: "Unable to update consent right now. Please try again later.",
    });
  }
}

module.exports = {
  updateConsent,
};
