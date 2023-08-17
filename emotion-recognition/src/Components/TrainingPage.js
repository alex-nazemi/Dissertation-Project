import React, { useState, useEffect, useRef } from "react";
import * as tf from "@tensorflow/tfjs";
import styled from "styled-components";

const TrainingContainer = styled.div`
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  background-color: #f7f7f7;
  font-family: Arial, sans-serif;
`;

const ButtonContainer = styled.div`
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  gap: 10px;
`;

const StimulusImage = styled.img`
  width: 400px;
  height: auto;
  margin-bottom: 20px;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
`;

const ChoiceButton = styled.button`
  background-color: #007bff;
  color: white;
  padding: 10px 20px;
  margin: 5px;
  border: none;
  border-radius: 4px;
  font-size: 16px;
  cursor: pointer;
  transition: background-color 0.3s ease;

  &:hover {
    background-color: #0056b3;
  }

  &:focus {
    outline: none;
  }
`;

const FeedbackText = styled.p`
  font-size: 18px;
  color: #333;
  margin-top: 20px;
`;

const PromptText = styled.p`
  font-size: 20px;
  color: #555;
  margin-bottom: 20px;
`;

const TrainingPage = () => {
  const videoRef = useRef(null);
  const [model, setModel] = useState(null);
  const [stimulusImage, setStimulusImage] = useState("");
  const [comparisonImage, setComparisonImage] = useState("");
  const [feedback, setFeedback] = useState("");
  const [round, setRound] = useState(0);
  const [isComparing, setIsComparing] = useState(false);
  const [promptText, setPromptText] = useState("");
  const MAX_ROUNDS = 15;

  const emotionLabels = [
    "anger",
    "disgust",
    "fear",
    "happy",
    "neutral",
    "sad",
    "surprise",
  ];
  const stimuliPaths = "EmotionalStimuli";

  useEffect(() => {
    async function setupWebcam() {
      if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: true,
        });
        videoRef.current.srcObject = stream;
      }
    }

    setupWebcam();
  }, []);

  useEffect(() => {
    async function loadModel() {
      const loadedModel = await tf.loadLayersModel("/model_output/model.json");
      setModel(loadedModel);
    }

    loadModel();
  }, []);

  useEffect(() => {
    setPromptText("What does this image make you feel?");
  }, []);

  function getRandomImagePath(emotion) {
    const randomIndex = Math.floor(Math.random() * 10) + 1;
    return `/${stimuliPaths}/${emotion}/${emotion}${randomIndex}.jpg`;
  }

  function getComparisonImagePath(emotion) {
    const randomImageIndex = Math.floor(Math.random() * 6) + 1;
    return `/Images/${emotion}/${randomImageIndex}.jpg`;
  }

  const detectEmotion = (video) => {
    if (!model) return null;

    const tensor = tf.browser
      .fromPixels(video)
      .resizeNearestNeighbor([48, 48])
      .mean(2)
      .toFloat()
      .expandDims(-1)
      .expandDims(0);
    const predictions = model.predict(tensor);
    const predictedIndex = predictions.argMax(-1).dataSync()[0];
    const detectedEmotion = emotionLabels[predictedIndex];
    console.log(`${detectedEmotion}`);
    return detectedEmotion;
  };

  const handleUserChoice = async (chosenEmotion) => {
    if (!isComparing) {
      const detectedEmotion = await detectEmotion(videoRef.current);
      if (chosenEmotion === detectedEmotion) {
        setFeedback("Your feelings match the model's prediction.");
      } else {
        setFeedback(`Model detected: ${detectedEmotion}.`);
      }

      setComparisonImage(getComparisonImagePath(chosenEmotion));
      setIsComparing(true);
      setPromptText("What emotion do you think is being shown in the image?");
    } else {
      if (chosenEmotion === comparisonImage.split("/")[2].split(".")[0]) {
        setFeedback("Correct! That's the emotion shown in the image.");
      } else {
        setFeedback("Try again.");
      }

      if (round < MAX_ROUNDS) {
        const randomEmotion =
          emotionLabels[Math.floor(Math.random() * emotionLabels.length)];
        setStimulusImage(getRandomImagePath(randomEmotion));
        setRound(round + 1);
        setPromptText("What does this image make you feel?");
      } else {
        setFeedback("Thank you for participating!");
        setStimulusImage("");
      }

      setIsComparing(false);
      setComparisonImage("");
    }
  };

  return (
    <TrainingContainer>
      <video
        ref={videoRef}
        width="640"
        height="480"
        autoPlay
        style={{ display: "none" }}
      ></video>
      {promptText && <PromptText>{promptText}</PromptText>}
      {stimulusImage && !comparisonImage && (
        <StimulusImage src={stimulusImage} alt="Stimulus" />
      )}
      {comparisonImage && (
        <StimulusImage src={comparisonImage} alt="Comparison Emotion" />
      )}
      <ButtonContainer>
        {emotionLabels.map((choice) => (
          <ChoiceButton key={choice} onClick={() => handleUserChoice(choice)}>
            {choice}
          </ChoiceButton>
        ))}
      </ButtonContainer>

      {feedback && <FeedbackText>{feedback}</FeedbackText>}
    </TrainingContainer>
  );
};

export default TrainingPage;
