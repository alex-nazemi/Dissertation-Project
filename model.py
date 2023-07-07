# # import os
# # import numpy as np
# # import cv2
# # from sklearn.model_selection import train_test_split
# # from keras.utils import to_categorical
# # from keras.models import Sequential
# # from keras.layers import Conv2D, MaxPooling2D, Flatten, Dense

# # # Define the path to the training folder
# # train_folder = "/Users/alexnazemi/Desktop/Disseration Project/dataset/train"

# # # Define the emotions and their corresponding labels
# # emotions = {
# #     "angry": 0,
# #     "disgust": 1,
# #     "fear": 2,
# #     "happy": 3,
# #     "sad": 4,
# #     "surprise": 5,
# #     "neutral": 6
# # }

# # # Initialize empty lists for storing images and labels
# # images = []
# # labels = []

# # # Iterate over the images in the training folder
# # for emotion_folder in os.listdir(train_folder):
# #     emotion_label = emotions[emotion_folder]
# #     emotion_path = os.path.join(train_folder, emotion_folder)
    
# #     for image_name in os.listdir(emotion_path):
# #         image_path = os.path.join(emotion_path, image_name)
        
# #         # Read the image using OpenCV
# #         image = cv2.imread(image_path)
        
# #         # Perform any necessary preprocessing on the image
# #         # (e.g., resizing, normalization, etc.)
        
# #         # Append the preprocessed image and its label to the lists
# #         images.append(image)
# #         labels.append(emotion_label)

# # # Convert the lists to numpy arrays
# # images = np.array(images)
# # labels = np.array(labels)

# # # Split the dataset into training and validation sets
# # X_train, X_val, y_train, y_val = train_test_split(images, labels, test_size=0.2, random_state=42)

# # # Perform one-hot encoding on the labels
# # y_train = to_categorical(y_train)
# # y_val = to_categorical(y_val)

# # # Define the architecture of the model
# # model = Sequential()
# # model.add(Conv2D(32, (3, 3), activation='relu', input_shape=X_train.shape[1:]))
# # model.add(MaxPooling2D((2, 2)))
# # model.add(Conv2D(64, (3, 3), activation='relu'))
# # model.add(MaxPooling2D((2, 2)))
# # model.add(Conv2D(128, (3, 3), activation='relu'))
# # model.add(MaxPooling2D((2, 2)))
# # model.add(Flatten())
# # model.add(Dense(64, activation='relu'))
# # model.add(Dense(len(emotions), activation='softmax'))

# # # Compile the model
# # model.compile(optimizer='adam', loss='categorical_crossentropy', metrics=['accuracy'])

# # # Train the model
# # model.fit(X_train, y_train, batch_size=32, epochs=10, validation_data=(X_val, y_val))

# # # Save the trained model for future use
# # model.save('my_model.keras')

# import os
# import numpy as np
# import cv2
# from sklearn.model_selection import train_test_split
# from keras.utils import to_categorical
# from keras.models import Sequential
# from keras.layers import Conv2D, MaxPooling2D, Flatten, Dense

# # Define the path to the training folder
# train_folder = "/Users/alexnazemi/Desktop/Disseration Project/dataset/train"

# # Define the emotions and their corresponding labels
# emotions = {
#     "angry": 0,
#     "disgust": 1,
#     "fear": 2,
#     "happy": 3,
#     "sad": 4,
#     "surprise": 5,
#     "neutral": 6
# }

# # Initialize empty lists for storing images and labels
# images = []
# labels = []

# # Iterate over the images in the training folder
# for emotion_folder in os.listdir(train_folder):
#     emotion_label = emotions[emotion_folder]
#     emotion_path = os.path.join(train_folder, emotion_folder)
    
#     for image_name in os.listdir(emotion_path):
#         image_path = os.path.join(emotion_path, image_name)
        
#         # Read the image using OpenCV
#         image = cv2.imread(image_path)
        
#         # Perform any necessary preprocessing on the image
#         # (e.g., resizing, normalization, etc.)
        
#         # Append the preprocessed image and its label to the lists
#         images.append(image)
#         labels.append(emotion_label)

# # Convert the lists to numpy arrays
# images = np.array(images)
# labels = np.array(labels)

# # Split the dataset into training and validation sets
# X_train, X_val, y_train, y_val = train_test_split(images, labels, test_size=0.2, random_state=42)

# # Perform one-hot encoding on the labels
# y_train = to_categorical(y_train)
# y_val = to_categorical(y_val)

# # Define the architecture of the model
# model = Sequential()
# model.add(Conv2D(32, (3, 3), activation='relu', input_shape=X_train.shape[1:]))
# model.add(MaxPooling2D((2, 2)))
# model.add(Conv2D(64, (3, 3), activation='relu'))
# model.add(MaxPooling2D((2, 2)))
# model.add(Conv2D(128, (3, 3), activation='relu'))
# model.add(MaxPooling2D((2, 2)))
# model.add(Flatten())
# model.add(Dense(64, activation='relu'))
# model.add(Dense(len(emotions), activation='softmax'))

# # Compile the model
# model.compile(optimizer='adam', loss='categorical_crossentropy', metrics=['accuracy'])

# # Train the model
# model.fit(X_train, y_train, batch_size=32, epochs=11, validation_data=(X_val, y_val))

# # Save the trained model for future use
# model.save('my_model2.keras')

from keras.models import Sequential
from keras.layers import Conv2D, MaxPooling2D, Flatten, Dense, Dropout

# Define the input shape
input_shape = (48, 48, 1)  # Assuming input images are grayscale and have size 48x48

# Create the model
model = Sequential()

# Add convolutional and pooling layers
model.add(Conv2D(32, (3, 3), activation='relu', input_shape=input_shape))
model.add(Conv2D(32, (3, 3), activation='relu'))
model.add(MaxPooling2D(pool_size=(2, 2)))
model.add(Dropout(0.25))

model.add(Conv2D(64, (3, 3), activation='relu'))
model.add(Conv2D(64, (3, 3), activation='relu'))
model.add(MaxPooling2D(pool_size=(2, 2)))
model.add(Dropout(0.25))

model.add(Conv2D(128, (3, 3), activation='relu'))
model.add(Conv2D(128, (3, 3), activation='relu'))
model.add(MaxPooling2D(pool_size=(2, 2)))
model.add(Dropout(0.25))

# Flatten the feature maps
model.add(Flatten())

# Add fully connected layers
model.add(Dense(256, activation='relu'))
model.add(Dropout(0.5))
model.add(Dense(128, activation='relu'))
model.add(Dense(7, activation='softmax'))  # Output layer with 7 emotion classes

# Compile the model
model.compile(optimizer='adam', loss='categorical_crossentropy', metrics=['accuracy'])

# Print the model summary
model.summary()
model.save('my_model3.keras')