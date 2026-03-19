function predictDiabetes({ glucose, bmi }) {
  if (glucose > 140 || bmi > 30) {
    return "Diabetic";
  }

  return "Not Diabetic";
}

module.exports = {
  predictDiabetes,
};
