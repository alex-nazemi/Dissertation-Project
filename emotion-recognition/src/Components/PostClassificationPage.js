import React, { useState, useEffect, useRef } from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import { useScores } from "./ScoreContext";

const GameContainer = styled.div`
  text-align: center;
`;

const Image = styled.img`
  width: 60%;
  max-width: 400px;
  height: auto;
  display: block;
  margin: 0 auto;
`;

const Button = styled.button`
  width: 200px;
  height: 60px;
  font-size: 16px;
  text-align: center;
  border: none;
  background-color: #007bff;
  color: white;
  cursor: pointer;
  margin: 10px;
  &:hover {
    background-color: #0056b3;
  }
`;

const Score = styled.p`
  font-size: 18px;
  font-weight: bold;
`;

const PostClassificationPage = () => {
  const emotions = [
    "angry",
    "disgust",
    "fear",
    "happy",
    "neutral",
    "sad",
    "surprise",
  ];

  const emotionsRef = useRef(emotions);
  const [score, setScore] = useState(0);
  const [stage, setStage] = useState(0);
  const [image, setImage] = useState("");
  const [options, setOptions] = useState([]);
  const [correctAnswer, setCorrectAnswer] = useState("");

  const navigate = useNavigate();
  const { setPostScore } = useScores();

  useEffect(() => {
    if (stage < 10) {
      const randomEmotion =
        emotionsRef.current[
          Math.floor(Math.random() * emotionsRef.current.length)
        ];
      const randomImageNumber = Math.floor(Math.random() * 6) + 1;
      const imagePath = `Images/${randomEmotion}/${randomImageNumber}.jpg`;

      const wrongOptions = emotionsRef.current.filter(
        (e) => e !== randomEmotion
      );
      const shuffledOptions = wrongOptions.sort(() => Math.random() - 0.5);
      const finalOptions = [randomEmotion, ...shuffledOptions.slice(0, 3)].sort(
        () => Math.random() - 0.5
      );

      setImage(imagePath);
      setOptions(finalOptions);
      setCorrectAnswer(randomEmotion);
    } else if (stage === 10) {
      setPostScore(score); 

      setTimeout(() => {
        navigate("/results");
      }, 2000);
    }
  }, [stage, navigate, setPostScore, score]);

  const handleAnswer = (option) => {
    if (option === correctAnswer) {
      setScore(score + 1);
    }
    setStage(stage + 1);
  };

  return (
    <GameContainer>
      {stage < 10 ? (
        <>
          <Image src={image} alt="emotion" />
          <div>
            {options.map((option, index) => (
              <Button key={index} onClick={() => handleAnswer(option)}>
                {option.charAt(0).toUpperCase() + option.slice(1)}
              </Button>
            ))}
          </div>
        </>
      ) : (
        <Score>Your final score is: {score} / 10</Score>
      )}
    </GameContainer>
  );
};

export default PostClassificationPage;
