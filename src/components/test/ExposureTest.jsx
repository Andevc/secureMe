import { useState } from "react";
import { questions } from "../data/questions";
import { calculateRisk } from "../lib/scoreCalculator";

export default function ExposureTest() {

  const [answers, setAnswers] = useState({});
  const [result, setResult] = useState(null);

  const handleAnswer = (questionId, value) => {
    setAnswers((prev) => ({
      ...prev,
      [questionId]: value
    }));
  };

  const handleSubmit = () => {
    const riskResult = calculateRisk(answers);
    setResult(riskResult);
  };

  return (
    <div className="max-w-2xl mx-auto p-6">

      <h2 className="text-2xl font-bold mb-6">
        Test de exposición digital
      </h2>

      {questions.map((q) => (
        <div
          key={q.id}
          className="mb-6 p-4 border rounded-lg"
        >
          <p className="mb-3">{q.question}</p>

          <div className="flex gap-3">

            {q.options.map((opt) => (
              <button
                key={opt.label}
                onClick={() => handleAnswer(q.id, opt.value)}
                className="px-4 py-2 border rounded hover:bg-gray-100"
              >
                {opt.label}
              </button>
            ))}

          </div>
        </div>
      ))}

      <button
        onClick={handleSubmit}
        className="mt-4 px-6 py-3 bg-blue-600 text-white rounded"
      >
        Ver resultado
      </button>

      {result && (
        <div className="mt-8 p-6 border rounded-lg">

          <h3 className="text-xl font-semibold mb-2">
            Resultado
          </h3>

          <p className="text-lg">
            Score: <strong>{result.score}/100</strong>
          </p>

          <p className="text-lg">
            Nivel de riesgo: <strong>{result.riskLevel}</strong>
          </p>

        </div>
      )}

    </div>
  );
}
