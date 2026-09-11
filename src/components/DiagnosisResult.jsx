import { CONFIDENCE_THRESHOLD } from '../lib/predict'

export default function DiagnosisResult({ imageSrc, disease, confidence }) {
  const isLowConfidence = confidence < CONFIDENCE_THRESHOLD
  const isHealthy = disease.severity === 'sain'
  const confidencePct = Math.round(confidence * 100)

  return (
    <section className="result" aria-live="polite">
      <div className="result__media">
        <img src={imageSrc} alt="Feuille analysée" />
      </div>

      <div className="result__body">
        <span className={`result__badge result__badge--${disease.severity}`}>
          {isHealthy ? 'Sain' : `Sévérité ${disease.severity}`}
        </span>

        <h3 className="result__title">{disease.label}</h3>
        <p className="result__description">{disease.description}</p>

        <div className="result__confidence">
          <div className="result__confidence-row">
            <span>Confiance du modèle</span>
            <span>{confidencePct}%</span>
          </div>
          <div className="result__confidence-bar">
            <div
              className="result__confidence-fill"
              style={{ width: `${confidencePct}%` }}
            />
          </div>
        </div>

        {isLowConfidence && (
          <div className="result__warning" role="alert">
            <strong>Résultat incertain.</strong> La confiance est en dessous du seuil
            recommandé. Reprenez la photo avec un meilleur éclairage et un cadrage net
            sur la feuille, ou faites confirmer le diagnostic par un agent CARDER/ATDA
            avant tout traitement.
          </div>
        )}

        <div className="result__recommendation">
          <h4>Recommandation</h4>
          <p>{disease.recommendation}</p>
        </div>

        <p className="result__disclaimer">
          Ce diagnostic est une aide à la décision basée sur un modèle d'IA entraîné sur
          un jeu de données limité. Il ne remplace pas l'avis d'un agronome pour les cas
          sévères ou incertains.
        </p>
      </div>
    </section>
  )
}
