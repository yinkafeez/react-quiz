import { useQuiz } from "../context/QuizContext";

export default function FinishedScreen() {
  const { point, sumPoints, highscore, dispatch } = useQuiz();

  //   final score percentage
  const percentage = (point / sumPoints) * 100;

  let emoji;
  if (percentage === 100) emoji = "🥇";
  else if (percentage >= 80 && percentage < 100) emoji = "🥀";
  else if (percentage >= 50 && percentage < 80) emoji = "👲";
  else if (percentage >= 0 && percentage < 50) emoji = "😞";
  else if (percentage === 0) emoji = "🤔";
  return (
    <>
      <p className="result">
        <span>{emoji}</span>You scored <strong>{point} </strong> out of{" "}
        {sumPoints} ({Math.ceil(percentage)}%)
      </p>

      <p className="highscore"> (Highscore: {highscore} points) </p>
      <button
        className="btn btn-ui"
        onClick={() => dispatch({ type: "restart" })}
      >
        Restart quiz
      </button>
    </>
  );
}
