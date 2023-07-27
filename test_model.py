import os
import cv2
import numpy as np
from keras.models import load_model
from keras.utils import to_categorical

# Define the path to the FER-2013 test dataset directory
test_data_path = "/content/Dissertation-Project/dataset/test"

# Define the list of emotions and their corresponding labels
emotion_labels = {
    'angry': 0,
    'disgust': 1,
    'fear': 2,
    'happy': 3,
    'neutral': 4,
    'sad': 5,
    'surprise': 6
}

# Load the test images and labels
test_images = []
test_labels = []

for emotion_folder in os.listdir(test_data_path):
    emotion = emotion_folder
    emotion_folder_path = os.path.join(test_data_path, emotion_folder)

    # Skip non-directory files
    if not os.path.isdir(emotion_folder_path):
        continue

    for image_filename in os.listdir(emotion_folder_path):
        # Skip non-image files
        if not image_filename.endswith(('.jpg', '.jpeg', '.png')):
            continue

        image_path = os.path.join(emotion_folder_path, image_filename)
        image = cv2.imread(image_path, cv2.IMREAD_GRAYSCALE)
        image = cv2.resize(image, (48, 48))  # Resize images to the desired shape
        test_images.append(image)
        test_labels.append(emotion_labels[emotion])

# Convert test images and labels to numpy arrays
test_images = np.array(test_images)
test_labels = np.array(test_labels)

# Normalize pixel values to range between 0 and 1
test_images = test_images / 255.0

# Perform one-hot encoding on the test labels
test_labels = to_categorical(test_labels)

# Load the trained model
model_path = "/content/Dissertation-Project/my_model_with_early_stopping.keras"
model = load_model(model_path)

# Evaluate the model on the test set
loss, accuracy = model.evaluate(test_images, test_labels)

print(f"Test Loss: {loss:.4f}")
print(f"Test Accuracy: {accuracy:.4f}")
