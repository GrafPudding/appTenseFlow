import { ref, onUnmounted } from 'vue'

export type FacingMode = 'user' | 'environment'

export function useCamera() {
  const videoRef = ref<HTMLVideoElement | null>(null)
  const stream = ref<MediaStream | null>(null)
  const isActive = ref(false)
  const error = ref<string | null>(null)
  const facingMode = ref<FacingMode>('user')

  const startCamera = async (video: HTMLVideoElement) => {
    videoRef.value = video
    error.value = null

    try {
      const videoConstraints: MediaStreamConstraints = {
        video: {
          facingMode: facingMode.value,
          width: { ideal: 640 },
          height: { ideal: 480 }
        },
        audio: false
      }

      stream.value = await navigator.mediaDevices.getUserMedia(videoConstraints)

      video.srcObject = stream.value
      video.style.transform = facingMode.value === 'user' ? 'scaleX(-1)' : 'scaleX(1)'
      await video.play()
      isActive.value = true
    } catch (e) {
      if (e instanceof Error) {
        if (e.name === 'NotAllowedError') {
          error.value = 'Camera permission denied'
        } else {
          error.value = e.message
        }
      }
      console.error('Camera error:', e)
    }
  }

  const stopCamera = () => {
    if (stream.value) {
      stream.value.getTracks().forEach(track => track.stop())
      stream.value = null
    }
    if (videoRef.value) {
      videoRef.value.srcObject = null
    }
    isActive.value = false
  }

  const switchCamera = async () => {
    facingMode.value = facingMode.value === 'user' ? 'environment' : 'user'
    const video = videoRef.value

    if (video && stream.value) {
      stopCamera()
      await startCamera(video)
    }
  }

  onUnmounted(() => {
    stopCamera()
  })

  return {
    videoRef,
    isActive,
    error,
    facingMode,
    startCamera,
    stopCamera,
    switchCamera
  }
}