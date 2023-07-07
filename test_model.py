import os
import cv2
import numpy as np
from keras.models import load_model
from keras.utils import to_categorical

# Load the trained model
model = load_model("/Users/alexnazemi/Desktop/Disseration Project/my_model2.keras")

# Define the emotions and their corresponding labels
emotions = {
    "angry": 0,
    "disgust": 1,
    "fear": 2,
    "happy": 3,
    "neutral": 4,
    "sad": 5,
    "surprise": 6
}

# Define the path to the test folder
test_folder = "/Users/alexnazemi/Desktop/Disseration Project/dataset/test"

# Initialize empty lists for storing test images and labels
test_images = []
test_labels = []

# Iterate over the emotions and load the test images
for emotion_folder in emotions:
    emotion_label = emotions[emotion_folder]
    emotion_path = os.path.join(test_folder, emotion_folder)

    for image_name in os.listdir(emotion_path):
        image_path = os.path.join(emotion_path, image_name)

        # Read the test image using OpenCV
        image = cv2.imread(image_path)

        # Perform any necessary preprocessing on the test image
        # (e.g., resizing, normalization, etc.)

        # Append the preprocessed test image and its label to the lists
        test_images.append(image)
        test_labels.append(emotion_label)

# Convert the test image and label lists to numpy arrays
test_images = np.array(test_images)
test_labels = np.array(test_labels)

# Preprocess the test images
# ... Code to preprocess the test images ...

# Convert the ground truth labels to one-hot encoded vectors
one_hot_labels = to_categorical(test_labels, num_classes=7)

# Perform predictions on the preprocessed test images
predictions = model.predict(test_images)

# Evaluate the model
accuracy = model.evaluate(test_images, one_hot_labels)

# Print the accuracy
print("Test Accuracy:", accuracy)
