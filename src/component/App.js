import Header from "./Header";
import Main from "./Main";
import Loader from "./Loader";
import Error from "./Error";
import StartScreen from "./StartScreen";
import Question from "./Question";
import NextButton from "./NextButton";
import Progress from "./Progress";
import FinishedScreen from "./FinishedScreen";
import Footer from "./Footer";
import Timer from "./Timer";
import { useQuiz } from "../context/QuizContext";

export default function App() {
  // from context
  const { status } = useQuiz();

  return (
    <div className="app">
      <Header />
      <Main>
        {/* when loading */}
        {status === "loading" && <Loader />}

        {/* on error discovered */}
        {status === "error" && <Error />}

        {/* when it data has load fifnish, it should display the landing page */}
        {status === "ready" && <StartScreen />}

        {/* when user want to start the quiz , active */}
        {status === "active" && (
          <>
            {/* Progresss bar */}
            <Progress />

            {/* questions */}
            <Question />

            <Footer>
              {/* timer */}
              <Timer />

              {/* displaying next button*/}
              <NextButton />
            </Footer>
          </>
        )}

        {/* when the user finish answering the qustion */}
        {status === "finished" && <FinishedScreen />}
      </Main>
    </div>
  );
}
