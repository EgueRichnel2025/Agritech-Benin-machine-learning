import { CULTURES } from '../lib/diseases'

export default function CultureSwitch({ value, onChange }) {
  return (
    <div className="culture-switch" role="radiogroup" aria-label="Choix de la culture">
      {CULTURES.map((culture) => (
        <button
          key={culture.id}
          type="button"
          role="radio"
          aria-checked={value === culture.id}
          className={`culture-switch__option ${value === culture.id ? 'is-active' : ''}`}
          onClick={() => onChange(culture.id)}
        >
          {culture.label}
        </button>
      ))}
    </div>
  )
}
