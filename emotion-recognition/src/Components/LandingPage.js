import React from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';

const LandingContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
  background-color: #f3f3f3;
`;

const Title = styled.h1`
  color: #333;
  font-size: 36px;
`;

const StartButton = styled(Link)`
  display: inline-block;
  background-color: #007bff;
  color: white;
  padding: 10px 20px;
  text-decoration: none;
  font-size: 20px;
  border-radius: 5px;
  transition: background-color 0.2s;

  &:hover {
    background-color: #0056b3;
  }
`;

const LandingPage = () => {
  return (
    <LandingContainer>
      <Title>Welcome to Emotion Recognition Game</Title>
      <StartButton to="/game">Start</StartButton>
    </LandingContainer>
  );
};

export default LandingPage;
