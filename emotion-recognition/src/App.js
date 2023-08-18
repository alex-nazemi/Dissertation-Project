import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import LandingPage from "./Components/LandingPage";
import GamePage from "./Components/GamePage";
import TrainingPage from "./Components/TrainingPage";
import PostClassificationPage from "./Components/PostClassificationPage";
import ResultsPage from "./Components/ResultsPage";
import { ScoreProvider } from "./Components/ScoreContext";

const App = () => {
  return (
    <ScoreProvider>
      <Router>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/game" element={<GamePage />} />
          <Route path="/training" element={<TrainingPage />} />
          <Route
            path="/post-classification"
            element={<PostClassificationPage />}
          />
          <Route path="/results" element={<ResultsPage />} />Ï
        </Routes>
      </Router>
    </ScoreProvider>
  );
};

export default App;
