import { createContext, useContext, useEffect, useReducer } from "react";

const QuizContext = createContext();

//  number of seconds per each question
const SECS_PER_QUESTION = 30;

const initialState = {
  // questions
  questions: [],

  // 'loading' , 'error', 'ready', 'active', 'finished'
  status: "loading",

  // state that tracks the active question
  index: 0,

  // state to  store the answer clicked
  answer: null,

  // user's point
  point: 0,

  // high score by the user
  highscore: 0,

  // time
  secondsRemaining: null,
};

// reducer
function reducer(state, action) {
  switch (action.type) {
    // when the data has been fetched succesfully on mount, status = ready
    case "dataReceived":
      return {
        ...state,
        questions: action.payload,
        status: "ready",
      };

    // when the data fetched failed, status = error
    case "dataFailed":
      return { ...state, status: "error" };

    // when "let's start" btn is clicked to start quiz
    case "startQuiz":
      return {
        ...state,
        status: "active",
        secondsRemaining: state.questions.length * SECS_PER_QUESTION,
      };

    // updating answer
    case "newAnswer":
      // chcking the cuurent questions
      const question = state.questions[state.index];

      // checking the right answer, and increasing the points if the answer clicked is the rigth answer
      return {
        ...state,
        answer: action.payload,
        point:
          action.payload === question.correctOption
            ? state.point + question.points
            : state.point,
      };

    // showing of the next question
    case "nextQuestion":
      return { ...state, index: state.index + 1, answer: null };

    //  when the user finish answering the questions
    case "finish":
      return {
        ...state,
        status: "finished",
        highscore:
          state.point > state.highscore ? state.point : state.highscore,
      };

    // when the user want to restart the quiz, reset every thing back to its initial except the question
    case "restart":
      return {
        ...state,
        status: "ready",
        index: 0,
        answer: null,
        point: 0,
        highscore: 0,
        secondsRemaining: null,
      };

    // timer
    case "tick":
      return {
        ...state,
        secondsRemaining: state.secondsRemaining - 1,
        status: state.secondsRemaining === 0 ? "finished" : state.status,
      };

    default:
      throw new Error("Action unknown");
  }
}

function QuizProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, initialState);

  // destructuring state value
  const {
    questions,
    status,
    index,
    answer,
    point,
    highscore,
    secondsRemaining,
  } = state;

  // calulation the number of available questionns
  const numQuestions = questions.length;

  // calculating the sum total of points
  const sumPoints = questions.reduce((prev, cur) => prev + cur.points, 0);

  // fetching questions data
  useEffect(function () {
    async function fetchQuestions() {
      try {
        const res = await fetch("http://localhost:3000/questions");
        const data = await res.json();
        // storing fetched data to questions array
        dispatch({ type: "dataReceived", payload: data });
      } catch (err) {
        dispatch({ type: "dataFailed" });
      }
    }
    fetchQuestions();
  }, []);

  // handling display quiz qeustions on btn click
  function handleStartQuiz() {
    dispatch({ type: "startQuiz" });
  }

  // handling the answer clicked
  function handleAnswer(index) {
    dispatch({ type: "newAnswer", payload: index });
  }

  return (
    <QuizContext.Provider
      value={{
        questions,
        status,
        index,
        answer,
        point,
        highscore,
        secondsRemaining,
        numQuestions,
        sumPoints,
        dispatch,
        handleStartQuiz,
        handleAnswer,
      }}
    >
      {children}
    </QuizContext.Provider>
  );
}

function useQuiz() {
  const context = useContext(QuizContext);

  if (context === undefined)
    throw new Error("QuizCOntext was used outside Quiz Provider");
  return context;
}

export { QuizProvider, useQuiz };
