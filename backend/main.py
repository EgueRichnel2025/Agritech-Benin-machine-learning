from pathlib import Path
from io import BytesIO

import numpy as np
import tensorflow as tf
from PIL import Image
from fastapi import FastAPI, File, UploadFile, HTTPException
from fastapi.middleware.cors import CORSMiddleware
# ============================================================
# Chemins
# ============================================================

BASE_DIR = Path(__file__).resolve().parent
MODEL_PATH = BASE_DIR / "model" / "best_model.keras"
CLASS_NAMES_PATH = BASE_DIR / "model" / "class_names.txt"


# ============================================================
# Chargement du modèle
# ============================================================

print("Chargement du modèle...")

model = tf.keras.models.load_model(MODEL_PATH)

with open(CLASS_NAMES_PATH, "r", encoding="utf-8") as file:
    CLASS_NAMES = [line.strip() for line in file if line.strip()]

print(f"Modèle chargé : {MODEL_PATH}")
print(f"Classes : {CLASS_NAMES}")


# ============================================================
# Application FastAPI
# ============================================================

app = FastAPI(
    title="AgriTech Bénin - API Machine Learning",
    description="API de détection des maladies des cultures",
    version="1.0.0",
)


# ============================================================
# CORS
# ============================================================

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# ============================================================
# Prétraitement de l'image
# ============================================================

def preprocess_image(image: Image.Image) -> np.ndarray:
    """
    Prépare une image pour le modèle MobileNetV2.

    Le modèle a été entraîné avec :
    - taille : 224 x 224
    - 3 canaux RGB
    - normalisation : [-1, 1]
    """

    image = image.convert("RGB")
    image = image.resize((224, 224))

    image_array = np.array(image, dtype=np.float32)

    # Ajout de la dimension batch
    image_array = np.expand_dims(image_array, axis=0)

    return image_array


# ============================================================
# Routes
# ============================================================

@app.get("/")
def root():
    return {
        "message": "AgriTech Bénin ML API",
        "status": "running",
        "model": "MobileNetV2",
        "classes": CLASS_NAMES,
    }


@app.get("/health")
def health():
    return {
        "status": "healthy",
        "model_loaded": model is not None,
        "classes_count": len(CLASS_NAMES),
    }


@app.post("/predict")
async def predict(file: UploadFile = File(...)):
    """
    Reçoit une image et retourne la classe prédite
    ainsi que la confiance du modèle.
    """

    # Vérification du type de fichier
    if not file.content_type or not file.content_type.startswith("image/"):
        raise HTTPException(
            status_code=400,
            detail="Le fichier envoyé doit être une image.",
        )

    try:
        # Lecture du fichier
        contents = await file.read()

        # Ouverture de l'image
        image = Image.open(BytesIO(contents))

        # Prétraitement
        input_data = preprocess_image(image)

        # Prédiction
        predictions = model.predict(input_data, verbose=0)

        probabilities = predictions[0]

        predicted_index = int(np.argmax(probabilities))
        confidence = float(probabilities[predicted_index])

        predicted_class = CLASS_NAMES[predicted_index]

        return {
            "class": predicted_class,
            "confidence": confidence,
            "confidence_percent": round(confidence * 100, 2),
            "class_index": predicted_index,
        }

    except Exception as error:
        raise HTTPException(
            status_code=500,
            detail=f"Erreur lors de l'analyse de l'image : {str(error)}",
        )