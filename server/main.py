from fastapi import FastAPI, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from PIL import Image
import io

app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

from tensorflow.keras.models import load_model
# Load the trained model
model = load_model('model.h5')
from keras.preprocessing.image import load_img, img_to_array
import numpy as np
import matplotlib.pyplot as plt

# Class labels
class_labels = ['pituitary', 'glioma', 'notumor', 'meningioma']

# Preprocess bytes data into model input
def preprocess_image_bytes(img_bytes, image_size=128):
    img = Image.open(io.BytesIO(img_bytes)).convert("RGB")
    img = img.resize((image_size, image_size))
    img_array = img_to_array(img) / 255.0
    return np.expand_dims(img_array, axis=0)

# Predict and return label and confidence
def predict_image(img_bytes):
    img_array = preprocess_image_bytes(img_bytes)
    preds = model.predict(img_array)
    idx = np.argmax(preds, axis=1)[0]
    conf = float(np.max(preds, axis=1)[0])
    label = class_labels[idx]
    result = "No Tumor" if label == 'notumor' else f"Tumor: {label}"
    return result, conf

# HTTP endpoint for prediction
@app.post("/predict")
async def predict(file: UploadFile = File(...)):
    img_bytes = await file.read()
    result, confidence = predict_image(img_bytes)
    return JSONResponse({"result": result, "confidence": confidence})