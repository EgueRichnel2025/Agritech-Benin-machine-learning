import { useCallback, useRef, useState } from 'react'

// Extrait une frame d'un fichier vidéo (à mi-parcours) et la renvoie comme
// data URL, pour pouvoir la traiter exactement comme une photo.
function extractFrameFromVideoFile(file) {
  return new Promise((resolve, reject) => {
    const video = document.createElement('video')
    video.preload = 'metadata'
    video.muted = true
    video.src = URL.createObjectURL(file)

    video.onloadedmetadata = () => {
      video.currentTime = Math.min(1, video.duration / 2)
    }
    video.onseeked = () => {
      const canvas = document.createElement('canvas')
      canvas.width = video.videoWidth
      canvas.height = video.videoHeight
      const ctx = canvas.getContext('2d')
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height)
      URL.revokeObjectURL(video.src)
      resolve(canvas.toDataURL('image/jpeg', 0.9))
    }
    video.onerror = () => reject(new Error("Impossible de lire ce fichier vidéo."))
  })
}

export default function UploadZone({ onImageReady, disabled }) {
  const [isDragging, setIsDragging] = useState(false)
  const [cameraActive, setCameraActive] = useState(false)
  const [error, setError] = useState(null)
  const fileInputRef = useRef(null)
  const videoRef = useRef(null)
  const streamRef = useRef(null)

  const handleFile = useCallback(
    async (file) => {
      setError(null)
      try {
        if (file.type.startsWith('video/')) {
          const dataUrl = await extractFrameFromVideoFile(file)
          onImageReady(dataUrl, { sourceType: 'video', fileName: file.name })
        } else if (file.type.startsWith('image/')) {
          const dataUrl = await new Promise((resolve, reject) => {
            const reader = new FileReader()
            reader.onload = () => resolve(reader.result)
            reader.onerror = () => reject(new Error('Lecture du fichier impossible.'))
            reader.readAsDataURL(file)
          })
          onImageReady(dataUrl, { sourceType: 'image', fileName: file.name })
        } else {
          setError('Format non pris en charge. Utilisez une image ou une vidéo.')
        }
      } catch (err) {
        setError(err.message || "Une erreur est survenue pendant la lecture du fichier.")
      }
    },
    [onImageReady],
  )

  const handleDrop = (event) => {
    event.preventDefault()
    setIsDragging(false)
    const file = event.dataTransfer.files?.[0]
    if (file) handleFile(file)
  }

  const openCamera = async () => {
    setError(null)
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment' },
      })
      streamRef.current = stream
      setCameraActive(true)
      // Le flux est attaché à l'élément <video> au prochain rendu, via le ref callback.
      requestAnimationFrame(() => {
        if (videoRef.current) {
          videoRef.current.srcObject = stream
        }
      })
    } catch (err) {
      setError(
        "Impossible d'accéder à la caméra. Vérifiez les autorisations du navigateur, ou importez une photo depuis votre galerie.",
      )
    }
  }

  const closeCamera = () => {
    streamRef.current?.getTracks().forEach((track) => track.stop())
    streamRef.current = null
    setCameraActive(false)
  }

  const capturePhoto = () => {
    const video = videoRef.current
    if (!video) return
    const canvas = document.createElement('canvas')
    canvas.width = video.videoWidth
    canvas.height = video.videoHeight
    const ctx = canvas.getContext('2d')
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height)
    const dataUrl = canvas.toDataURL('image/jpeg', 0.9)
    closeCamera()
    onImageReady(dataUrl, { sourceType: 'camera' })
  }

  if (cameraActive) {
    return (
      <div className="upload-zone upload-zone--camera">
        {/* eslint-disable-next-line jsx-a11y/media-has-caption */}
        <video ref={videoRef} autoPlay playsInline className="upload-zone__video" />
        <div className="upload-zone__camera-controls">
          <button type="button" className="btn btn--primary" onClick={capturePhoto}>
            Capturer la photo
          </button>
          <button type="button" className="btn btn--ghost" onClick={closeCamera}>
            Annuler
          </button>
        </div>
      </div>
    )
  }

  return (
    <div
      className={`upload-zone ${isDragging ? 'is-dragging' : ''}`}
      onDragOver={(event) => {
        event.preventDefault()
        setIsDragging(true)
      }}
      onDragLeave={() => setIsDragging(false)}
      onDrop={handleDrop}
    >
      <p className="upload-zone__title">Glissez une photo de la feuille ici</p>
      <p className="upload-zone__subtitle">
        Ou choisissez un fichier image / vidéo, ou utilisez votre caméra
      </p>

      <div className="upload-zone__actions">
        <button
          type="button"
          className="btn btn--primary"
          disabled={disabled}
          onClick={() => fileInputRef.current?.click()}
        >
          Choisir un fichier
        </button>
        <button type="button" className="btn btn--ghost" disabled={disabled} onClick={openCamera}>
          Utiliser la caméra
        </button>
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*,video/*"
        hidden
        onChange={(event) => {
          const file = event.target.files?.[0]
          if (file) handleFile(file)
          event.target.value = ''
        }}
      />

      {error && <p className="upload-zone__error" role="alert">{error}</p>}
    </div>
  )
}
