import { useState } from 'react'
import CultureSwitch from './components/CultureSwitch'
import UploadZone from './components/UploadZone'
import DiagnosisResult from './components/DiagnosisResult'
import { DISEASES } from './lib/diseases'
import { predict } from './lib/predict'

export default function App() {
  const [culture, setCulture] = useState('tomate')
  const [status, setStatus] = useState('idle') // idle | analyzing | done | error
  const [image, setImage] = useState(null)
  const [result, setResult] = useState(null)
  const [errorMessage, setErrorMessage] = useState(null)

  const handleCultureChange = (nextCulture) => {
    setCulture(nextCulture)
    setStatus('idle')
    setImage(null)
    setResult(null)
    setErrorMessage(null)
  }

  const handleImageReady = async (dataUrl, meta) => {
    setImage(dataUrl)
    setStatus('analyzing')
    setErrorMessage(null)
    setResult(null)

    try {
      const imageFile = await dataUrlToFile(dataUrl, meta?.fileName || 'image.jpg')

      const prediction = await predict(imageFile)

      const disease = DISEASES[prediction.class]

      if (!disease) {
        throw new Error(
          `La classe "${prediction.class}" retournée par le modèle n'est pas configurée dans l'application.`,
        )
      }

      setResult({
        disease,
        confidence: prediction.confidence,
        className: prediction.class,
        meta,
      })

      setStatus('done')
    } catch (err) {
      console.error(err)
      setErrorMessage(
        err.message || "L'analyse a échoué. Réessayez avec une autre photo.",
      )
      setStatus('error')
    }
  }

  const reset = () => {
    setStatus('idle')
    setImage(null)
    setResult(null)
    setErrorMessage(null)
  }

  return (
    <div className="app">
      <header className="app__header">
        <div className="app__brand">
          <span className="app__brand-mark" aria-hidden="true" />
          <span className="app__brand-name">Agritech Bénin</span>
        </div>

        <CultureSwitch
          value={culture}
          onChange={handleCultureChange}
        />
      </header>

      <main className="app__main">
        <section className="hero">
          <h1 className="hero__title">
            Identifiez l'état de votre plant en une photo
          </h1>

          <p className="hero__subtitle">
            Prenez ou importez une photo de la feuille. Le modèle d'IA analyse
            l'image et retourne la classe détectée ainsi que son niveau de
            confiance.
          </p>
        </section>

        {status !== 'done' && (
          <UploadZone
            onImageReady={handleImageReady}
            disabled={status === 'analyzing'}
          />
        )}

        {status === 'analyzing' && (
          <div className="analyzing" role="status">
            <span className="analyzing__spinner" aria-hidden="true" />
            <span>Analyse de l'image en cours…</span>
          </div>
        )}

        {status === 'error' && (
          <div className="upload-zone__error" role="alert">
            {errorMessage}
          </div>
        )}

        {status === 'done' && result && (
          <>
            <DiagnosisResult
              imageSrc={image}
              disease={result.disease}
              confidence={result.confidence}
            />

            <button
              type="button"
              className="btn btn--ghost result__reset"
              onClick={reset}
            >
              Analyser une nouvelle photo
            </button>
          </>
        )}
      </main>

      <footer className="app__footer">
        <p>
          Prototype développé pour le hackathon Deep Learning IndabaX Bénin
          2026 × iSHEERO. Les prédictions sont réalisées par un modèle
          MobileNetV2 entraîné sur un sous-ensemble de PlantVillage.
        </p>
      </footer>
    </div>
  )
}

async function dataUrlToFile(dataUrl, fileName) {
  const response = await fetch(dataUrl)
  const blob = await response.blob()

  return new File([blob], fileName, {
    type: blob.type || 'image/jpeg',
  })
}
