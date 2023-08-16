import React, { useState, useEffect, useRef } from "react";
import * as tf from "@tensorflow/tfjs";
import styled from "styled-components";

const TrainingContainer = styled.div`
  text-align: center;
`;

const Video = styled.video`
  width: 60%;
  max-width: 400px;
  height: auto;
  display: block;
  margin: 0 auto;
`;

const TrainingPage = () => {
  const [emotion, setEmotion] = useState("");
  const videoRef = useRef(null);
  const [model, setModel] = useState(null);

  useEffect(() => {
    async function setupWebcam() {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      videoRef.current.srcObject = stream;
      return new Promise((resolve) => {
        videoRef.current.onloadedmetadata = () => {
          resolve(videoRef.current);
        };
      });
    }

    async function loadModel() {
      const loadedModel = await tf.loadLayersModel("/model/model.json");
      setModel(loadedModel);
    }

    setupWebcam().then((video) => {
      loadModel().then(() => {
        if (model) {
          detectEmotion(video);
        }
      });
    });
  }, [model]);

  const detectEmotion = (video) => {
    return tf.tidy(() => {
      const tensor = tf.browser
        .fromPixels(video)
        .resizeNearestNeighbor([48, 48])
        .mean(2)
        .toFloat()
        .expandDims(-1)
        .expandDims(0);
      const predictions = model.predict(tensor);

      const emotionLabels = [
        "anger",
        "contempt",
        "disgust",
        "fear",
        "happy",
        "neutral",
        "sad",
        "surprise",
      ];
      const predictedIndex = predictions.argMax(-1).dataSync()[0];
      const detectedEmotion = emotionLabels[predictedIndex];
      console.log(`Detected emotion: ${detectedEmotion}`);
    });
  };

  const checkEmotion = (userGuess) => {
    if (userGuess === emotion) {
    } else {
    }
  };

  return (
    <TrainingContainer>
      <Video ref={videoRef} autoPlay={true}></Video>
      <div></div>
    </TrainingContainer>
  );
};

export default TrainingPage;
