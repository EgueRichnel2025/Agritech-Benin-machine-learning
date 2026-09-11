export const DISEASES = {
  maize_cercospora: {
    label: 'Cercosporiose du maïs',
    severity: 'moyenne',
    description:
      'Maladie foliaire du maïs pouvant provoquer des lésions sur les feuilles et réduire la capacité de la plante à produire suffisamment de biomasse.',
    recommendation:
      'Surveillez l’évolution des lésions, favorisez une bonne aération des plants et pratiquez la rotation des cultures. Pour une décision de traitement, demandez confirmation à un agent agricole.',
  },

  maize_common_rust: {
    label: 'Rouille commune du maïs',
    severity: 'moyenne',
    description:
      'La rouille commune se manifeste généralement par des pustules brun-rouge à orangées sur les feuilles du maïs.',
    recommendation:
      'Surveillez les plants et privilégiez, lorsque cela est possible, des variétés présentant une bonne tolérance à la maladie. Une intervention doit être adaptée au niveau réel de l’infection.',
  },

  maize_healthy: {
    label: 'Maïs sain',
    severity: 'sain',
    description:
      'Aucun signe correspondant aux maladies de maïs reconnues par le modèle n’a été détecté sur la feuille analysée.',
    recommendation:
      'Continuez la surveillance régulière des plants et maintenez de bonnes pratiques culturales.',
  },

  maize_northern_leaf_blight: {
    label: 'Helminthosporiose du Nord du maïs',
    severity: 'moyenne',
    description:
      'Maladie foliaire caractérisée par des lésions allongées pouvant apparaître et s’étendre sur les feuilles du maïs.',
    recommendation:
      'Surveillez l’évolution des lésions, gérez correctement les résidus de culture et pratiquez la rotation. Faites confirmer les cas importants par un professionnel agricole.',
  },

  tomato_healthy: {
    label: 'Tomate saine',
    severity: 'sain',
    description:
      'Aucun signe correspondant au mildiou de la tomate reconnu par le modèle n’a été détecté sur la feuille analysée.',
    recommendation:
      'Continuez la surveillance régulière des plants et maintenez une bonne aération du feuillage.',
  },

  tomato_late_blight: {
    label: 'Mildiou de la tomate',
    severity: 'élevée',
    description:
      'Maladie pouvant provoquer des lésions sombres sur les feuilles et évoluer rapidement dans des conditions favorables, notamment lorsque l’humidité est importante.',
    recommendation:
      'Surveillez rapidement l’évolution des symptômes, retirez les parties fortement atteintes lorsque cela est approprié et demandez conseil à un professionnel agricole avant tout traitement.',
  },
}

export const CLASS_NAMES = Object.keys(DISEASES)

export const CULTURES = [
  { id: 'tomate', label: 'Tomate' },
  { id: 'mais', label: 'Maïs' },
]
