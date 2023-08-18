import { getAuth, onAuthStateChanged } from "firebase/auth";
import React, { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";
import LandingPage from "./Components/LandingPage";
import GamePage from "./Components/GamePage";
import TrainingPage from "./Components/TrainingPage";
import PostClassificationPage from "./Components/PostClassificationPage";
import ResultsPage from "./Components/ResultsPage";
import SignUp from "./Components/SignUp";
import { ScoreProvider } from "./Components/ScoreContext";

const App = () => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const authInstance = getAuth(); 

    const unsubscribe = onAuthStateChanged(authInstance, (authUser) => {
      if (authUser) {
        setUser(authUser);
      } else {
        setUser(null);
      }
    });

    return () => unsubscribe();
}, []);

  return (
    <ScoreProvider>
      <Router>
        <Routes>
          {user ? (
            <>
              <Route path="/" element={<LandingPage />} />
              <Route path="/game" element={<GamePage />} />
              <Route path="/training" element={<TrainingPage />} />
              <Route
                path="/post-classification"
                element={<PostClassificationPage />}
              />
              <Route path="/results" element={<ResultsPage />} />
            </>
          ) : (
            <>
              <Route path="/" element={<SignUp />} />
              <Route path="/*" element={<Navigate to="/" />} />
            </>
          )}
        </Routes>
      </Router>
    </ScoreProvider>
  );
};

export default App;
