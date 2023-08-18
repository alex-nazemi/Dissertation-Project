import { createContext, useContext, useState } from "react";

const ScoreContext = createContext();

export const useScores = () => {
  return useContext(ScoreContext);
};

export const ScoreProvider = ({ children }) => {
  const [preScore, setPreScore] = useState(null);
  const [postScore, setPostScore] = useState(null);

  const values = {
    preScore,
    setPreScore,
    postScore,
    setPostScore,
  };

  return <ScoreContext.Provider value={values}>{children}</ScoreContext.Provider>;
};
