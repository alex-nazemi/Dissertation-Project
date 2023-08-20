import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { useScores } from "./ScoreContext";
import { getAuth } from "firebase/auth";
import { fetchUserScores, storeUserScore } from "./firebaseUtilities";


const ResultsContainer = styled.div`
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  background-color: #f7f7f7;
  font-family: Arial, sans-serif;
  padding: 20px;
`;

const ResultsHeading = styled.h2`
  font-size: 28px;
  margin-bottom: 20px;
  color: #444;
`;

const FeedbackMessage = styled.p`
  font-size: 22px;
  color: ${(props) => (props.$positive ? "#007bff" : "#d9534f")};
  margin-top: 20px;
`;

const HistoricalScores = styled.div`
  margin-top: 30px;
  text-align: left;
  width: 80%;
`;

const HistoricalScoreItem = styled.div`
  padding: 10px;
  border-bottom: 1px solid #ddd;
`;

const ResultsPage = () => {
  const { preScore, postScore } = useScores();
  const [historicalScores, setHistoricalScores] = useState([]);

  useEffect(() => {
    const auth = getAuth();
    if (auth.currentUser) {
        const userId = auth.currentUser.uid;
        if (preScore && postScore) {
          storeUserScore(userId, preScore, postScore);
        }
    }
  }, [preScore, postScore]);

  useEffect(() => {
    const fetchScores = async () => {
      const auth = getAuth();
      if (auth.currentUser) {
        const scores = await fetchUserScores(auth.currentUser.uid);
        setHistoricalScores(scores);
      }
    };

    fetchScores();
  }, []);

  return (
    <ResultsContainer>
      <ResultsHeading>Results</ResultsHeading>
      <p>Pre-Classification Score: {preScore}</p>
      <p>Post-Classification Score: {postScore}</p>
      <FeedbackMessage $positive={postScore > preScore}>
        {postScore > preScore
          ? "Congratulations! You've improved."
          : "Keep practicing to improve!"}
      </FeedbackMessage>
      <HistoricalScores>
        <h3>Previous Scores:</h3>
        {Array.isArray(historicalScores) && historicalScores.map((scoreData, index) => (
          <HistoricalScoreItem key={index}>
            <p>
              Date:{" "}
              {new Date(scoreData.timestamp?.seconds * 1000).toLocaleString()}
            </p>
            <p>Pre-Classification Score: {scoreData.preTrainingScore}</p>
            <p>Post-Classification Score: {scoreData.postTrainingScore}</p>
          </HistoricalScoreItem>
        ))}
      </HistoricalScores>
    </ResultsContainer>
  );
};

export default ResultsPage;
