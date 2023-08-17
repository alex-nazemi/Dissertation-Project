import React, { useState, useEffect, useRef } from "react";
import * as tf from "@tensorflow/tfjs";
import styled from "styled-components";

const TrainingContainer = styled.div`
  text-align: center;
`;

const TrainingPage = () => {
  const videoRef = useRef(null);
  const [model, setModel] = useState(null);
  const [stimulusImage, setStimulusImage] = useState("");
  const [userChoices, setUserChoices] = useState([]);
  const [feedback, setFeedback] = useState("");
  const [round, setRound] = useState(0);
  const MAX_ROUNDS = 1;

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

  function getRandomImagePath(emotion) {
    const randomIndex = Math.floor(Math.random() * 6) + 1;
    return `/EmotionalStimuli/${emotion}/${emotion}${randomIndex}.jpg`;
  }

  useEffect(() => {
    async function setupWebcam() {
      await navigator.mediaDevices.getUserMedia({ video: true });
    }

    async function loadModel() {
      const loadedModel = await tf.loadLayersModel("/model_output/model.json");
      setModel(loadedModel);
    }

    setupWebcam().then(() => {
      loadModel().then(() => {
        if (model) {
          const randomEmotion =
            emotionLabels[Math.floor(Math.random() * emotionLabels.length)];
          setStimulusImage(getRandomImagePath(randomEmotion));
        }
      });
    });
  }, [model]);

  const detectEmotion = (video) => {
    // Detect emotion as before
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
    return detectedEmotion;
  };

  const handleUserChoice = async (chosenEmotion) => {
    const detectedEmotion = await detectEmotion(videoRef.current);
    if (chosenEmotion === detectedEmotion) {
      setFeedback("Your feelings match the model's prediction. Good job!");
    } else {
      setFeedback(`Model detected: ${detectedEmotion}. Try again.`);
      // Here, you can add code to show a human face image corresponding to 'detectedEmotion' and ask the user what emotion it is.
      // For simplicity, I'm skipping that part in this code.
    }

    // Move to the next round or finish the game
    if (round < MAX_ROUNDS) {
      const randomEmotion =
        emotionLabels[Math.floor(Math.random() * emotionLabels.length)];
      setStimulusImage(getRandomImagePath(randomEmotion));
      setRound(round + 1);
    } else {
      setFeedback("Thank you for participating!");
      setStimulusImage(""); // Hide the stimulus image
    }
  };

  return (
    <TrainingContainer>
      {stimulusImage && <img src={stimulusImage} alt="Stimulus" />}
      {userChoices.map((choice) => (
        <button onClick={() => handleUserChoice(choice)}>{choice}</button>
      ))}
      {feedback && <p>{feedback}</p>}
    </TrainingContainer>
  );
};

export default TrainingPage;
