# 🌾 AgriTech Bénin — Machine Learning

Plateforme intelligente dédiée au suivi de la santé des cultures grâce à l’**intelligence artificielle**, au **Machine Learning** et à la **vision par ordinateur**.

## 📌 Présentation

**AgriTech Bénin** est un projet développé autour d’une problématique agricole : permettre d’identifier plus rapidement certaines maladies affectant les cultures de **maïs** et de **tomate** à partir de photographies de feuilles.

L’objectif est d’intégrer un modèle de Deep Learning capable d’analyser une image et de retourner :

* la classe prédite ;
* le niveau de confiance de la prédiction ;
* la culture concernée ;
* l’état ou la maladie identifiée.

Le projet s’inscrit dans une démarche visant à **mettre l’intelligence artificielle au service de l’agriculture en Afrique**.

> ⚠️ Le système est un outil d’aide à l’identification. Il ne constitue pas un diagnostic agronomique définitif.

---

## 🎯 Objectifs

* Développer un système de reconnaissance automatique des maladies des plantes.
* Utiliser la vision par ordinateur pour analyser les feuilles des cultures.
* Faciliter l’identification précoce de certaines maladies.
* Expérimenter l’intégration d’un modèle de Deep Learning dans une application web.
* Explorer l'utilisation de l'IA pour répondre à des problématiques agricoles au Bénin et en Afrique.

---

## 🌽 Cultures prises en charge

Le modèle actuel reconnaît **6 classes** :

| Classe                       | Description               |
| ---------------------------- | ------------------------- |
| `maize_cercospora`           | Cercosporiose du maïs     |
| `maize_common_rust`          | Rouille commune du maïs   |
| `maize_healthy`              | Maïs sain                 |
| `maize_northern_leaf_blight` | Helminthosporiose du maïs |
| `tomato_healthy`             | Tomate saine              |
| `tomato_late_blight`         | Mildiou de la tomate      |

---

## 🤖 Modèle de Deep Learning

Le modèle utilisé est **MobileNetV2**, un réseau de neurones convolutif pré-entraîné sur ImageNet.

L'utilisation du Transfer Learning permet de bénéficier de caractéristiques visuelles déjà apprises tout en adaptant le modèle à notre problème de classification des maladies des plantes.

### Configuration

| Paramètre         | Valeur                          |
| ----------------- | ------------------------------- |
| Architecture      | MobileNetV2                     |
| Poids initiaux    | ImageNet                        |
| Taille des images | 224 × 224 × 3                   |
| Nombre de classes | 6                               |
| Optimiseur        | Adam                            |
| Learning rate     | 0.001                           |
| Fonction de perte | Sparse Categorical Crossentropy |
| Batch size        | 32                              |
| Dropout           | 0.2                             |
| Early Stopping    | Patience = 3                    |

### Prétraitement

Chaque image est :

1. redimensionnée en **224 × 224 pixels** ;
2. convertie au format approprié ;
3. normalisée dans l'intervalle **[-1, 1]**, conformément aux attentes de MobileNetV2.

---

## 📊 Données utilisées

Le modèle a été entraîné sur un sous-ensemble du jeu de données **PlantVillage**.

### Taille du dataset

**2 599 images**

| Classe                   |    Images |
| ------------------------ | --------: |
| Maïs — Cercosporiose     |       500 |
| Maïs — Rouille commune   |       500 |
| Maïs — Sain              |       499 |
| Maïs — Helminthosporiose |       500 |
| Tomate — Saine           |       300 |
| Tomate — Mildiou         |       300 |
| **Total**                | **2 599** |

### Répartition

| Ensemble     | Images |
| ------------ | -----: |
| Entraînement |  2 079 |
| Validation   |    259 |
| Test         |    261 |

---

## 📈 Résultats

Le modèle a obtenu les résultats suivants :

| Métrique                       |    Résultat |
| ------------------------------ | ----------: |
| Meilleure précision validation | **95,75 %** |
| Précision sur le test          | **93,49 %** |
| F1-score macro                 | **94,35 %** |

La précision de **93,49 %** est obtenue sur les **261 images du jeu de test** provenant du sous-ensemble PlantVillage utilisé pour l'entraînement.

### Résultats par classe

| Classe                   | Précision |  Rappel | F1-score |
| ------------------------ | --------: | ------: | -------: |
| Maïs — Cercosporiose     |   88,64 % | 78,00 % |  82,98 % |
| Maïs — Rouille commune   |     100 % | 98,00 % |  98,99 % |
| Maïs — Sain              |     100 % |   100 % |    100 % |
| Maïs — Helminthosporiose |   78,95 % | 90,00 % |  84,11 % |
| Tomate — Saine           |     100 % |   100 % |    100 % |
| Tomate — Mildiou         |     100 % |   100 % |    100 % |

---

## 🧩 Architecture envisagée

L'intégration du modèle dans la plateforme peut suivre le flux suivant :

```text
┌─────────────────────┐
│   Utilisateur       │
│ photographie feuille│
└──────────┬──────────┘
           │
           ▼
┌─────────────────────┐
│ Prétraitement image │
│ 224 × 224 + [-1,1]  │
└──────────┬──────────┘
           │
           ▼
┌─────────────────────┐
│     MobileNetV2     │
│  Modèle de Deep     │
│      Learning       │
└──────────┬──────────┘
           │
           ▼
┌─────────────────────┐
│    Classification   │
│ maladie + confiance│
└──────────┬──────────┘
           │
           ▼
┌─────────────────────┐
│ Résultat présenté   │
│     à l'utilisateur │
└─────────────────────┘
```

---

## 🛠️ Technologies

### Intelligence artificielle

* Python
* TensorFlow
* Keras
* MobileNetV2
* Deep Learning
* Computer Vision
* Scikit-learn
* NumPy

### Application

* React
* Vite
* JavaScript
* Tailwind CSS

### Versionnement

* Git
* GitHub

---

## ⚠️ Limites actuelles

Le modèle a été évalué sur un sous-ensemble de PlantVillage. Les performances obtenues ne doivent donc pas être interprétées comme une garantie de performance dans les champs réels.

Les principales limites sont :

* diversité limitée des conditions d'acquisition ;
* différences d'éclairage ;
* arrière-plans variables ;
* feuilles partiellement visibles ;
* symptômes similaires entre certaines maladies ;
* manque potentiel d'images provenant directement de cultures béninoises ou africaines.

Une difficulté particulière est observée entre certaines maladies du maïs présentant des symptômes visuellement proches.

---

## 🚀 Feuille de route

### Phase 1 — Modèle ML

* [x] Préparation du dataset
* [x] Prétraitement des images
* [x] Entraînement de MobileNetV2
* [x] Évaluation du modèle
* [x] Sauvegarde du meilleur modèle

### Phase 2 — Intégration

* [ ] Chargement d'une image depuis l'interface
* [ ] Prétraitement automatique
* [ ] Exécution du modèle
* [ ] Affichage de la classe prédite
* [ ] Affichage de la confiance

### Phase 3 — Amélioration

* [ ] Ajouter davantage de données
* [ ] Ajouter des images provenant de conditions réelles
* [ ] Tester le fine-tuning
* [ ] Tester d'autres architectures
* [ ] Ajouter de nouvelles maladies
* [ ] Ajouter d'autres cultures

### Phase 4 — Déploiement

* [ ] Mettre en place une API d'inférence
* [ ] Connecter le modèle au frontend
* [ ] Optimiser les temps de prédiction
* [ ] Préparer un déploiement cloud

---

## 🌍 Vision

À terme, l'objectif est de développer des outils d'intelligence artificielle capables d'aider les agriculteurs à détecter plus rapidement certains problèmes affectant leurs cultures.

Cette approche pourrait contribuer à rendre les technologies de **Computer Vision et d'IA plus accessibles au secteur agricole africain**, tout en encourageant le développement de solutions adaptées aux réalités locales.

---

## 🏆 Contexte du projet

Ce projet est lié au **Deep Learning IndabaX Bénin 2026**.

Ce dépôt personnel sert également de terrain d'expérimentation pour approfondir l'intégration de modèles de Machine Learning dans des applications web et développer des compétences pratiques en **AI Engineering**.

---

## ⚠️ Avertissement

Ce projet constitue un **prototype de recherche et d'expérimentation**.

Les prédictions du modèle ne doivent pas être utilisées seules pour prendre une décision concernant le traitement d'une culture. Une vérification par un agronome ou un professionnel compétent reste recommandée.
