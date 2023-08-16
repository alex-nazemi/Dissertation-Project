import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import LandingPage from './Components/LandingPage';
import GamePage from './Components/GamePage';
import TrainingPage from './Components/TrainingPage';  // <-- Import this

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/game" element={<GamePage />} />
        <Route path="/training" element={<TrainingPage />} /> 
      </Routes>
    </Router>
  );
};

export default App;
