const API_URL = 'http://127.0.0.1:8000'

export const CONFIDENCE_THRESHOLD = 0.65

export async function predict(imageFile) {
  const formData = new FormData()
  formData.append('file', imageFile)

  const response = await fetch(`${API_URL}/predict`, {
    method: 'POST',
    body: formData,
  })

  if (!response.ok) {
    let message = "Erreur lors de l'analyse de l'image."

    try {
      const errorData = await response.json()

      if (errorData.detail) {
        message = errorData.detail
      }
    } catch {
      // On conserve le message par défaut.
    }

    throw new Error(message)
  }

  return await response.json()
}
