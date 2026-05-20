<template>
  <ion-page>
    <ion-header>
      <ion-toolbar color="dark">
        <ion-buttons slot="start">
          <ion-back-button default-href="/tabs/home" color="light" />
        </ion-buttons>
        <ion-title>{{ exerciseConfig?.name || 'Entrenament' }}</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content :fullscreen="true" class="ion-padding">
      <div class="detection-container">
        <div class="camera-wrapper" :class="{ 'loading': isLoading }">
          <video
            ref="videoRef"
            class="camera-video"
            autoplay
            playsinline
            muted
          ></video>

          <canvas
            ref="canvasRef"
            class="face-overlay"
            :style="{ transform: 'scaleX(-1)' }"
          ></canvas>

          <div v-if="!isActive && !error" class="loading-overlay">
            <div class="spinner"></div>
            <span>Carregant càmera...</span>
          </div>

          <div v-if="error" class="error-overlay">
            <ion-icon :icon="alertCircleOutline" class="error-icon" />
            <span>{{ error }}</span>
            <ion-button size="small" @click="initCamera">
              Reintentar
            </ion-button>
          </div>

          <div v-if="isLoading" class="model-loading">
            <div class="loader"></div>
            <span>Carregant model IA...</span>
          </div>
        </div>

        <div class="stats-bar">
          <div class="stat-item">
            <span class="stat-label">Detections</span>
            <span class="stat-value">{{ detectionCount }}</span>
          </div>
          <div class="stat-item quality">
            <span class="stat-label">Confidence</span>
            <span class="stat-value confidence">{{ avgConfidence }}%</span>
          </div>
        </div>

        <div class="feedback-section">
          <div v-if="currentFace" class="feedback-item success">
            <ion-icon :icon="checkmarkCircleOutline" />
            <span>Rostre detectat</span>
          </div>
          <div v-else class="feedback-placeholder">
            Posiciona't davant la càmera
          </div>
        </div>

        <div class="controls">
          <ion-button
            expand="block"
            size="large"
            :color="isDetecting ? 'danger' : 'primary'"
            @click="toggleDetection"
          >
            <ion-icon :icon="isDetecting ? pauseOutline : playOutline" slot="start" />
            {{ isDetecting ? 'Aturar' : 'Iniciar' }}
          </ion-button>

          <ion-button expand="block" fill="outline" @click="resetCount">
            <ion-icon :icon="refreshOutline" slot="start" />
            Reiniciar
          </ion-button>
        </div>

        <div class="performance-info">
          <span>FPS: {{ fps }}</span>
          <span>Lat: {{ lastInference }}ms</span>
        </div>
      </div>
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, watch } from 'vue'
import {
  IonPage, IonHeader, IonToolbar, IonTitle, IonContent,
  IonButtons, IonBackButton, IonButton, IonIcon
} from '@ionic/vue'
import {
  playOutline, pauseOutline, refreshOutline, alertCircleOutline,
  checkmarkCircleOutline
} from 'ionicons/icons'
import { useCamera } from '../composables/useCamera'
import { useFaceDetection } from '../composables/useFaceDetection'

const videoRef = ref<HTMLVideoElement | null>(null)
const canvasRef = ref<HTMLCanvasElement | null>(null)
const currentFace = ref<any>(null)
const isDetecting = ref(false)

const exerciseConfig = computed(() => ({
  name: 'Detecció Facial',
  color: '#6C5CE7'
}))

const { isActive, error, startCamera, stopCamera } = useCamera()
const { isLoading, isReady, fps, lastInferenceTime, loadModel, detectFaces } = useFaceDetection()

const detectionCount = ref(0)
const avgConfidence = ref(0)

let animationId: number | null = null

const lastInference = computed(() => lastInferenceTime.value)

const drawFaceBox = (face: any) => {
  if (!canvasRef.value || !videoRef.value) return

  const ctx = canvasRef.value.getContext('2d')
  if (!ctx) return

  ctx.clearRect(0, 0, canvasRef.value.width, canvasRef.value.height)

  const topLeft = face.topLeft as number[]
  const bottomRight = face.bottomRight as number[]
  const x = topLeft[0]
  const y = topLeft[1]
  const w = bottomRight[0] - topLeft[0]
  const h = bottomRight[1] - topLeft[1]

  ctx.strokeStyle = '#6C5CE7'
  ctx.lineWidth = 3
  ctx.strokeRect(x, y, w, h)

  if (face.landmarks) {
    face.landmarks.forEach((kp: number[]) => {
      ctx.beginPath()
      ctx.arc(kp[0], kp[1], 4, 0, 2 * Math.PI)
      ctx.fillStyle = '#00CEC9'
      ctx.fill()
    })

    if (face.landmarks.length >= 5) {
      const leftEye = face.landmarks[0]
      const rightEye = face.landmarks[1]
      const nose = face.landmarks[2]
      const leftMouth = face.landmarks[3]
      const rightMouth = face.landmarks[4]

      ctx.beginPath()
      ctx.moveTo(leftEye[0], leftEye[1])
      ctx.lineTo(nose[0], nose[1])
      ctx.lineTo(rightEye[0], rightEye[1])
      ctx.strokeStyle = '#FDCB6E'
      ctx.lineWidth = 2
      ctx.stroke()

      ctx.beginPath()
      ctx.moveTo(leftMouth[0], leftMouth[1])
      ctx.lineTo(rightMouth[0], rightMouth[1])
      ctx.stroke()
    }
  }
}

const detect = async () => {
  if (!videoRef.value || !isReady.value || !isDetecting.value) {
    if (isDetecting.value) animationId = requestAnimationFrame(detect)
    return
  }

  const face = await detectFaces(videoRef.value)
  if (face && face.length > 0) {
    currentFace.value = face[0]
    detectionCount.value++
    const prob = face[0].probability?.[0] || 0.5
    avgConfidence.value = Math.round(prob * 100)
    drawFaceBox(face[0])
  } else {
    currentFace.value = null
    if (canvasRef.value) {
      const ctx = canvasRef.value.getContext('2d')
      ctx?.clearRect(0, 0, canvasRef.value.width, canvasRef.value.height)
    }
  }

  if (isDetecting.value) {
    animationId = requestAnimationFrame(detect)
  }
}

const toggleDetection = async () => {
  if (isDetecting.value) {
    isDetecting.value = false
    if (animationId) {
      cancelAnimationFrame(animationId)
      animationId = null
    }
  } else {
    if (!isReady.value) await loadModel()
    isDetecting.value = true
    detect()
  }
}

const resetCount = () => {
  detectionCount.value = 0
  avgConfidence.value = 0
  currentFace.value = null
  if (canvasRef.value) {
    const ctx = canvasRef.value.getContext('2d')
    ctx?.clearRect(0, 0, canvasRef.value.width, canvasRef.value.height)
  }
}

const initCamera = async () => {
  if (videoRef.value && canvasRef.value) {
    canvasRef.value.width = videoRef.value.videoWidth || 640
    canvasRef.value.height = videoRef.value.videoHeight || 480
    await startCamera(videoRef.value)
  }
}

onMounted(async () => {
  await loadModel()
  await initCamera()
})

watch(isActive, (active) => {
  if (active && isDetecting.value) {
    detect()
  }
})

onUnmounted(() => {
  if (animationId) {
    cancelAnimationFrame(animationId)
  }
  stopCamera()
})
</script>

<style scoped>
.detection-container {
  display: flex;
  flex-direction: column;
  gap: 20px;
  height: 100%;
}

.camera-wrapper {
  position: relative;
  width: 100%;
  aspect-ratio: 4/3;
  background: #16213E;
  border-radius: 20px;
  overflow: hidden;
}

.camera-video {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.face-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
}

.loading-overlay,
.error-overlay,
.model-loading {
  position: absolute;
  inset: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 12px;
  background: rgba(22, 33, 62, 0.9);
  color: #A0A0B0;
  font-size: 14px;
}

.spinner {
  width: 40px;
  height: 40px;
  border: 3px solid #2a2a4a;
  border-top-color: #6C5CE7;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.error-icon {
  font-size: 48px;
  color: #E17055;
}

.error-overlay ion-button {
  margin-top: 8px;
}

.loader {
  width: 40px;
  height: 40px;
  border: 3px solid #2a2a4a;
  border-top-color: #00CEC9;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

.stats-bar {
  display: flex;
  justify-content: space-around;
  background: #16213E;
  border-radius: 16px;
  padding: 16px;
}

.stat-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
}

.stat-label {
  font-size: 12px;
  color: #A0A0B0;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.stat-value {
  font-size: 32px;
  font-weight: 700;
  color: #FFFFFF;
  font-family: 'Roboto Mono', monospace;
}

.stat-value.confidence {
  color: #00B894;
}

.feedback-section {
  background: #16213E;
  border-radius: 16px;
  padding: 16px;
  min-height: 60px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.feedback-item {
  display: flex;
  align-items: center;
  gap: 8px;
  color: #A0A0B0;
}

.feedback-item.success {
  color: #00B894;
}

.feedback-item ion-icon {
  font-size: 20px;
}

.feedback-placeholder {
  color: #A0A0B0;
  text-align: center;
  font-size: 14px;
}

.controls {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.performance-info {
  display: flex;
  justify-content: center;
  gap: 24px;
  color: #A0A0B0;
  font-size: 12px;
  font-family: 'Roboto Mono', monospace;
}

ion-content {
  --background: #1A1A2E;
}

ion-toolbar {
  --background: #16213E;
}
</style>