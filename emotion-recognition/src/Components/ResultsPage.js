import React from "react";
import { useScores } from "./ScoreContext";

const ResultsPage = () => {
  const { preScore, postScore } = useScores();

  return (
    <div>
      <h2>Results</h2>
      <p>Pre-Classification Score: {preScore}</p>
      <p>Post-Classification Score: {postScore}</p>
      <p>
        {postScore > preScore
          ? "Congratulations! You've improved."
          : "Keep practicing to improve!"}
      </p>
    </div>
  );
};

export default ResultsPage;
