# Agritech Bénin — Machine Learning

Modèle de classification d'images destiné à l'identification de maladies sur les feuilles de maïs et de tomate.

Ce projet constitue la partie Machine Learning du projet **Agritech Bénin**, développé dans le cadre d'un projet collaboratif. Cette version personnelle se concentre sur l'entraînement, l'évaluation et l'intégration d'un modèle de Deep Learning capable de classifier des images de feuilles.

## Objectif

L'objectif est de développer un modèle capable d'analyser une image de feuille et de prédire la classe correspondante parmi six catégories :

* Cercosporiose du maïs
* Rouille commune du maïs
* Maïs sain
* Helminthosporiose du Nord du maïs
* Tomate saine
* Mildiou de la tomate

Le modèle peut ensuite être utilisé par une application pour fournir une première orientation à partir d'une image.

> Ce modèle constitue un outil d'aide à l'orientation et ne remplace pas l'expertise d'un agronome ou d'un professionnel du domaine.

## Classes du modèle

| Classe                       | Description                       |
| ---------------------------- | --------------------------------- |
| `maize_cercospora`           | Cercosporiose du maïs             |
| `maize_common_rust`          | Rouille commune du maïs           |
| `maize_healthy`              | Maïs sain                         |
| `maize_northern_leaf_blight` | Helminthosporiose du Nord du maïs |
| `tomato_healthy`             | Tomate saine                      |
| `tomato_late_blight`         | Mildiou de la tomate              |

## Dataset

Le modèle a été entraîné sur un sous-ensemble du dataset PlantVillage.

Le dataset utilisé contient :

* 2 599 images au total
* 2 079 images pour l'entraînement
* 259 images pour la validation
* 261 images pour le test

Répartition des classes :

| Classe                       | Nombre d'images |
| ---------------------------- | --------------: |
| `maize_cercospora`           |             500 |
| `maize_common_rust`          |             500 |
| `maize_healthy`              |             499 |
| `maize_northern_leaf_blight` |             500 |
| `tomato_healthy`             |             300 |
| `tomato_late_blight`         |             300 |

## Modèle

Le modèle repose sur **MobileNetV2** pré-entraîné sur ImageNet.

Architecture utilisée :

```text
Image 224 × 224 × 3
        |
        v
Data Augmentation
        |
        v
Rescaling [0, 255] -> [-1, 1]
        |
        v
MobileNetV2
        |
        v
Global Average Pooling
        |
        v
Dropout
        |
        v
Dense 6 classes
        |
        v
Softmax
```

### Paramètres principaux

* Architecture : MobileNetV2
* Poids initiaux : ImageNet
* Taille d'entrée : `224 × 224`
* Nombre de classes : `6`
* Batch size : `32`
* Optimiseur : Adam
* Learning rate initial : `0.001`
* Fonction de perte : Sparse Categorical Crossentropy
* Activation finale : Softmax

## Data Augmentation

Le modèle utilise des transformations appliquées aux images pendant l'entraînement afin d'améliorer sa capacité de généralisation.

Les transformations utilisées comprennent notamment :

* retournement horizontal ;
* rotation ;
* zoom ;
* modification du contraste ;
* translation.

Le preprocessing spécifique à MobileNetV2 est réalisé directement dans le modèle avec une couche `Rescaling`.

## Résultats du modèle V1

Sur le jeu de test PlantVillage :

```text
Test Loss     : 0.1627
Test Accuracy : 93.49 %
```

### Classification report

| Classe                     | Precision | Recall | F1-score |
| -------------------------- | --------: | -----: | -------: |
| Maize Cercospora           |    0.8864 | 0.7800 |   0.8298 |
| Maize Common Rust          |    1.0000 | 0.9800 |   0.9899 |
| Maize Healthy              |    1.0000 | 1.0000 |   1.0000 |
| Maize Northern Leaf Blight |    0.7895 | 0.9000 |   0.8411 |
| Tomato Healthy             |    1.0000 | 1.0000 |   1.0000 |
| Tomato Late Blight         |    1.0000 | 1.0000 |   1.0000 |

Accuracy globale :

```text
93.49 %
```

Macro F1-score :

```text
94.35 %
```

## Limites identifiées

Les performances obtenues sur le dataset de test sont bonnes, mais des tests avec des images provenant de sources externes ont montré un problème de généralisation.

Le modèle peut notamment avoir des difficultés lorsque les images diffèrent fortement des images utilisées pendant l'entraînement :

* conditions d'éclairage différentes ;
* arrière-plans différents ;
* angles de prise de vue différents ;
* qualité ou résolution différente ;
* apparence différente des symptômes.

Une confusion particulièrement importante est observée entre :

```text
maize_cercospora
```

et

```text
maize_northern_leaf_blight
```

Ces limites sont prises en compte dans les prochaines versions du modèle.

## Améliorations prévues

Les prochaines versions du modèle auront pour objectif d'améliorer la généralisation sur des images réelles.

Les pistes étudiées sont notamment :

1. Renforcement de la data augmentation.
2. Fine-tuning des dernières couches de MobileNetV2.
3. Évaluation sur un ensemble d'images externes au dataset PlantVillage.
4. Analyse détaillée des erreurs de classification.
5. Comparaison avec d'autres architectures de Deep Learning.
6. Amélioration des performances sur les maladies présentant des symptômes similaires.

## API FastAPI

Le modèle est également intégré dans une API développée avec **FastAPI**.

L'API permet d'envoyer une image et d'obtenir une prédiction.

Endpoint principal :

```text
POST /predict
```

Le serveur :

1. reçoit l'image ;
2. la convertit au format RGB ;
3. la redimensionne en `224 × 224` ;
4. transmet les pixels au modèle ;
5. récupère les probabilités des six classes ;
6. retourne la classe prédite et son niveau de confiance.

Le preprocessing n'effectue pas de normalisation manuelle supplémentaire puisque le modèle contient déjà sa propre couche `Rescaling`.

## Frontend

Une interface web développée avec **React** et **Vite** permet à l'utilisateur :

* de sélectionner une image ;
* de l'envoyer au backend ;
* d'obtenir la prédiction du modèle ;
* de consulter le résultat et les informations associées à la classe prédite.

Technologies utilisées :

* React
* Vite
* JavaScript
* CSS
* FastAPI
* TensorFlow / Keras
* MobileNetV2
* Python

## Structure du projet

```text
Agritech-Benin-machine-learning/
│
├── backend/
│   ├── model/
│   │   ├── best_model.keras
│   │   └── class_names.txt
│   │
│   └── main.py
│
├── src/
│   ├── components/
│   │   ├── CultureSwitch.jsx
│   │   ├── DiagnosisResult.jsx
│   │   └── UploadZone.jsx
│   │
│   ├── lib/
│   │   ├── diseases.js
│   │   └── predict.js
│   │
│   ├── App.jsx
│   ├── index.css
│   └── main.jsx
│
├── index.html
├── package.json
├── package-lock.json
├── vite.config.js
└── README.md
```

## Installation

### Frontend

Cloner le dépôt :

```bash
git clone https://github.com/EgueRichnel2025/Agritech-Benin-machine-learning.git
```

Entrer dans le projet :

```bash
cd Agritech-Benin-machine-learning
```

Installer les dépendances :

```bash
npm install
```

Lancer le frontend :

```bash
npm run dev
```

### Backend

Entrer dans le dossier backend :

```bash
cd backend
```

Créer un environnement virtuel :

```bash
python -m venv venv
```

Activer l'environnement virtuel sous Git Bash :

```bash
source venv/Scripts/activate
```

Installer les dépendances :

```bash
pip install fastapi uvicorn python-multipart tensorflow pillow numpy
```

Lancer l'API :

```bash
uvicorn main:app --reload
```

L'API sera alors disponible localement sur :

```text
http://127.0.0.1:8000
```

## Build du frontend

Pour générer la version de production :

```bash
npm run build
```

Les fichiers de production sont générés dans :

```text
dist/
```

## Déploiement

Le frontend est prévu pour être déployé sur Vercel.

Le backend FastAPI doit être déployé séparément sur une infrastructure capable d'exécuter Python et TensorFlow.

En production, l'URL du backend devra être configurée dans le frontend afin que l'application puisse communiquer avec l'API distante.

## Technologies

### Machine Learning

* Python
* TensorFlow
* Keras
* MobileNetV2
* Scikit-learn
* NumPy
* Matplotlib

### Backend

* FastAPI
* Uvicorn
* Python
* Pillow

### Frontend

* React
* Vite
* JavaScript
* CSS

### Outils

* Git
* GitHub
* Google Colab

## Projet original

Ce dépôt constitue une version personnelle du travail réalisé autour du projet **Agritech Bénin**.

Dépôt original du projet collaboratif :

```text
https://github.com/JusteAgbo05/agritech_benin
```

Cette version personnelle est utilisée pour documenter et approfondir le travail réalisé sur la partie Machine Learning et son intégration dans une application.

## Auteur

**Richnel EGUE**

Étudiant en Mathématique et Modélisation, spécialisation Machine Learning.

Intérêts :

* Artificial Intelligence
* Machine Learning
* Deep Learning
* Computer Vision
* Robotics
* AI Engineering
* Applications de l'IA dans la santé et l'agriculture
