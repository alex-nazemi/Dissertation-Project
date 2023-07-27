import os
import cv2
import numpy as np
from sklearn.model_selection import StratifiedKFold
from keras.utils import to_categorical
from keras.models import Sequential
from keras.layers import Conv2D, MaxPooling2D, Flatten, Dense, Dropout, BatchNormalization
import tensorflow.keras as keras
from keras.callbacks import EarlyStopping

# Define the path to the FER-2013 dataset directory
data_path = "/content/Dissertation-Project/dataset"

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

# Load the images and labels from the train dataset
train_images = []
train_labels = []

train_folder_path = os.path.join(data_path, "train")

for emotion_folder in os.listdir(train_folder_path):
    emotion = emotion_folder
    emotion_folder_path = os.path.join(train_folder_path, emotion_folder)

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
        train_images.append(image)
        train_labels.append(emotion_labels[emotion])

# Convert train images and labels to numpy arrays
train_images = np.array(train_images)
train_labels = np.array(train_labels)

# Normalize pixel values to range between 0 and 1
train_images = train_images / 255.0

# Perform one-hot encoding on the train labels
train_labels = to_categorical(train_labels)

# Define the model
input_shape = (48, 48, 1)  # Assuming input images are grayscale and have size 48x48
model = Sequential()
model.add(Conv2D(64, (3, 3), activation='relu', input_shape=input_shape))
model.add(Conv2D(64, (3, 3), activation='relu'))
model.add(MaxPooling2D(pool_size=(2, 2)))
model.add(BatchNormalization())
model.add(Dropout(0.25))
model.add(Conv2D(128, (3, 3), activation='relu'))
model.add(Conv2D(128, (3, 3), activation='relu'))
model.add(MaxPooling2D(pool_size=(2, 2)))
model.add(BatchNormalization())
model.add(Dropout(0.25))
model.add(Conv2D(256, (3, 3), activation='relu'))
model.add(Conv2D(256, (3, 3), activation='relu'))
model.add(MaxPooling2D(pool_size=(2, 2)))
model.add(BatchNormalization())
model.add(Dropout(0.25))
model.add(Flatten())
model.add(Dense(512, activation='relu'))
model.add(BatchNormalization())
model.add(Dropout(0.5))
model.add(Dense(256, activation='relu'))
model.add(BatchNormalization())
model.add(Dropout(0.5))
model.add(Dense(7, activation='softmax'))

# Compile the model with a lower learning rate
learning_rate = 0.001
optimizer = keras.optimizers.Adam(learning_rate=learning_rate)
model.compile(optimizer=optimizer, loss='categorical_crossentropy', metrics=['accuracy'])

# Perform cross-validation with early stopping
k_folds = 5
skf = StratifiedKFold(n_splits=k_folds, shuffle=True, random_state=42)

accuracies = []

for fold, (train_index, val_index) in enumerate(skf.split(train_images, np.argmax(train_labels, axis=1))):
    print(f"Training fold {fold + 1}/{k_folds}")

    # Split the data into training and validation sets
    X_train, X_val = train_images[train_index], train_images[val_index]
    y_train, y_val = train_labels[train_index], train_labels[val_index]

    # Define early stopping callback
    early_stopping = EarlyStopping(monitor='val_loss', patience=5, restore_best_weights=True)

    # Train the model with early stopping
    epochs = 100  # You can set a larger number and early stopping will stop when the validation loss doesn't improve for 5 epochs
    model.fit(X_train, y_train, validation_data=(X_val, y_val), epochs=epochs, batch_size=32, callbacks=[early_stopping])

    # Evaluate the model on the validation set
    _, accuracy = model.evaluate(X_val, y_val)
    accuracies.append(accuracy)

# Calculate the mean and standard deviation of accuracies
mean_accuracy = np.mean(accuracies)
std_accuracy = np.std(accuracies)
print(f"\nMean Accuracy: {mean_accuracy:.4f}")
print(f"Standard Deviation: {std_accuracy:.4f}")

# Save the model
model.save('my_model_with_early_stopping.keras')
