import React from "react";
import styled from "styled-components";
import { useScores } from "./ScoreContext";

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

const Score = styled.p`
  font-size: 20px;
  margin: 10px 0;
  color: #555;
`;

const FeedbackMessage = styled.p`
  font-size: 22px;
  color: ${props => (props.positive ? "#007bff" : "#d9534f")};
  margin-top: 20px;
`;

const ResultsPage = () => {
  const { preScore, postScore } = useScores();

  return (
    <ResultsContainer>
      <ResultsHeading>Results</ResultsHeading>
      <Score>Pre-Classification Score: {preScore}</Score>
      <Score>Post-Classification Score: {postScore}</Score>
      <FeedbackMessage positive={postScore > preScore}>
        {postScore > preScore
          ? "Congratulations! You've improved."
          : "Keep practicing to improve!"}
      </FeedbackMessage>
    </ResultsContainer>
  );
};

export default ResultsPage;
