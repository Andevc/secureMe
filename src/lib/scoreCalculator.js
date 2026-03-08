export function calculateRisk(answers) {
  const values = Object.values(answers);

  if (values.length === 0) {
    return {
      score: 0,
      riskLevel: "Bajo"
    };
  }

  const total = values.reduce((sum, value) => sum + value, 0);

  const maxScore = values.length * 5;

  const score = Math.round((total / maxScore) * 100);

  let riskLevel = "Bajo";

  if (score >= 80) {
    riskLevel = "Muy Alto";
  } else if (score >= 60) {
    riskLevel = "Alto";
  } else if (score >= 30) {
    riskLevel = "Medio";
  }

  return {
    score,
    riskLevel
  };
}