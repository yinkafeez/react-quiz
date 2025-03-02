import { useQuiz } from "../context/QuizContext";

export default function Question() {
  const { questions, index, answer, handleAnswer } = useQuiz();
  const question = questions[index];

  // checking if there is an answer
  const hasAnswer = answer !== null;

  return (
    <div>
      <h4>{question.question} </h4>

      <div className="options">
        {question.options.map((option, i) => (
          <button
            className={`btn btn-option ${i === answer ? "answer" : ""} ${
              hasAnswer
                ? i === question.correctOption
                  ? "correct"
                  : "wrong"
                : ""
            }`}
            key={i}
            disabled={hasAnswer}
            onClick={() => handleAnswer(i)}
          >
            {option}
          </button>
        ))}
      </div>
    </div>
  );
}
