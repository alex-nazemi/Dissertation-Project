import os
import numpy as np
import pandas as pd
from tensorflow.keras.preprocessing.image import ImageDataGenerator
from tensorflow.keras.applications import VGG16
from tensorflow.keras.layers import Dense, Dropout, Flatten
from tensorflow.keras.models import Model
from tensorflow.keras.optimizers import Adam
from tensorflow.keras.callbacks import ModelCheckpoint, EarlyStopping

# define directory and classes
data_dir = '/content/Dissertation-Project/affectnetdataset'
classes = ['anger', 'contempt', 'disgust', 'fear', 'happy', 'neutral', 'sad', 'surprise']

# load labels
labels = pd.read_csv(os.path.join(data_dir, 'labels.csv'))

# data augmentation
train_datagen = ImageDataGenerator(rescale=1./255, validation_split=0.2, rotation_range=30, width_shift_range=0.1, height_shift_range=0.1, zoom_range=0.2, horizontal_flip=True)

# generators
train_generator = train_datagen.flow_from_dataframe(dataframe=labels, directory=data_dir, x_col='pth', y_col='label', classes=classes, target_size=(48,48), batch_size=64, subset='training')
val_generator = train_datagen.flow_from_dataframe(dataframe=labels, directory=data_dir, x_col='pth', y_col='label', classes=classes, target_size=(48,48), batch_size=64, subset='validation')


# model architecture
base_model = VGG16(weights='imagenet', include_top=False, input_shape=(48,48,3))
x = base_model.output
x = Flatten()(x)
x = Dense(1024, activation='relu')(x)
x = Dropout(0.5)(x)
predictions = Dense(len(classes), activation='softmax')(x)
model = Model(inputs=base_model.input, outputs=predictions)

# compile the model
model.compile(optimizer=Adam(learning_rate=0.0001), loss='categorical_crossentropy', metrics=['accuracy'])

# callbacks
checkpoint = ModelCheckpoint('model_weights.h5', monitor='val_accuracy', save_weights_only=True, mode='max', verbose=1)
early_stopping = EarlyStopping(monitor='val_loss', min_delta=0.1, patience=5, mode='min', restore_best_weights=True)

# train the model
history = model.fit(train_generator, validation_data=val_generator, epochs=100, callbacks=[checkpoint, early_stopping])

# save the model
model.save('emotion_recognition_model.h5')
