import { useState } from "react";
import { questions } from "./questions";

export default function ExposureTest() {

  const [answers, setAnswers] = useState({});
  const [score, setScore] = useState(null);

  const handleAnswer = (id, riskValue) => {
    setAnswers({
      ...answers,
      [id]: riskValue
    });
  };

  const calculateScore = () => {
    const total = Object.values(answers).reduce((sum, value) => sum + value, 0);
    setScore(total);
  };

  return (
    <div className="max-w-2xl mx-auto p-4">

      <h2 className="text-2xl font-bold mb-6">
        Test de Exposición Digital
      </h2>

      {questions.map((q) => (
        <div key={q.id} className="mb-4 border p-4 rounded">

          <p className="mb-2 font-medium">{q.question}</p>

          <button
            className="mr-2 bg-red-500 text-white px-3 py-1 rounded"
            onClick={() => handleAnswer(q.id, q.risk)}
          >
            Sí
          </button>

          <button
            className="bg-green-500 text-white px-3 py-1 rounded"
            onClick={() => handleAnswer(q.id, 0)}
          >
            No
          </button>

        </div>
      ))}

      <button
        onClick={calculateScore}
        className="mt-6 bg-blue-600 text-white px-4 py-2 rounded"
      >
        Calcular Riesgo
      </button>

      {score !== null && (
        <div className="mt-6 text-xl font-bold">
          Tu riesgo de exposición es: {score} / 100
        </div>
      )}

    </div>
  );
}