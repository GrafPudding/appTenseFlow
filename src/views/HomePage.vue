<template>
  <ion-page>
    <ion-header>
      <ion-toolbar color="dark">
        <ion-title>
          <div class="title-container">
            <ion-icon :icon="flashOutline" class="title-icon" />
            TenseFlow
          </div>
        </ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content :fullscreen="true" class="ion-padding">
      <div class="home-container">
        <div class="status-card" :class="{ 'status-active': aiReady }">
          <div class="status-indicator">
            <div class="pulse-ring" v-if="aiReady"></div>
            <div class="status-dot" :class="{ active: aiReady }"></div>
          </div>
          <div class="status-info">
            <span class="status-label">{{ aiReady ? 'IA Llesta' : 'Carregant IA...' }}</span>
            <span class="status-detail" v-if="aiReady">
              FPS: {{ fps }} | Lat: {{ lastInference }}ms
            </span>
          </div>
        </div>

        <h2 class="section-title">Detecció Facial</h2>

        <div class="exercises-grid">
          <ion-card
            v-for="exercise in exercises"
            :key="exercise.type"
            class="exercise-card"
            :style="{ '--accent-color': exercise.color }"
            @click="startExercise(exercise.type)"
          >
            <ion-card-content>
              <div class="exercise-icon-container">
                <ion-icon :icon="getIcon(exercise.icon)" class="exercise-icon" />
              </div>
              <ion-card-title>{{ exercise.name }}</ion-card-title>
              <ion-card-subtitle>{{ exercise.description }}</ion-card-subtitle>
            </ion-card-content>
          </ion-card>
        </div>

        <div class="stats-section">
          <h3 class="section-title">Estadístiques</h3>
          <div class="stats-grid">
            <div class="stat-card">
              <ion-icon :icon="barbellOutline" />
              <span class="stat-value">{{ todaySessions }}</span>
              <span class="stat-label">Sessions avui</span>
            </div>
            <div class="stat-card">
              <ion-icon :icon="flameOutline" />
              <span class="stat-value">{{ estimatedCalories }}</span>
              <span class="stat-label">Calories</span>
            </div>
          </div>
        </div>

        <div class="info-card">
          <ion-icon :icon="informationCircleOutline" class="info-icon" />
          <p>
            TenseFlow utilitza <strong>Intel·ligència Artificial local</strong>
            per detectar rostres en temps real. Totes les dades es processen
            al teu dispositiu sense enviament al núvol.
          </p>
        </div>
      </div>
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import {
  IonPage, IonHeader, IonToolbar, IonTitle, IonContent,
  IonCard, IonCardContent, IonCardTitle, IonCardSubtitle, IonIcon
} from '@ionic/vue'
import {
  flashOutline, barbellOutline, flameOutline, fitnessOutline,
  walkOutline, eyeOutline, informationCircleOutline
} from 'ionicons/icons'
import { useFaceDetection } from '../composables/useFaceDetection'

const router = useRouter()
const { isReady: aiReady, fps, lastInferenceTime, loadModel } = useFaceDetection()
const lastInference = computed(() => lastInferenceTime.value)

const todaySessions = ref(2)
const estimatedCalories = computed(() => todaySessions.value * 72)

onMounted(async () => {
  await loadModel()
})

const exercises = [
  {
    type: 'face',
    name: 'Detecció Facial',
    icon: 'eye',
    color: '#6C5CE7',
    description: 'Detecta rostre i punts facials'
  },
  {
    type: 'emotions',
    name: 'Detecció Emocions',
    icon: 'happyOutline',
    color: '#00CEC9',
    description: 'Analitza expressions facials'
  },
  {
    type: 'objects',
    name: 'Detecció Objectes',
    icon: 'cubeOutline',
    color: '#FDCB6E',
    description: 'Identifica objectes en temps real'
  }
]

const getIcon = (icon: string) => {
  const icons: Record<string, string> = {
    eye: eyeOutline,
    fitness: fitnessOutline,
    walk: walkOutline,
    barbell: barbellOutline
  }
  return icons[icon] || eyeOutline
}

const startExercise = (type: string) => {
  router.push(`/tabs/detection/${type}`)
}
</script>

<style scoped>
.title-container {
  display: flex;
  align-items: center;
  gap: 8px;
  font-weight: 700;
}

.title-icon {
  color: #6C5CE7;
  font-size: 24px;
}

.home-container {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.status-card {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 16px;
  background: #16213E;
  border-radius: 16px;
  border: 1px solid #2a2a4a;
}

.status-card.status-active {
  border-color: #00CEC9;
}

.status-indicator {
  position: relative;
  width: 20px;
  height: 20px;
}

.status-dot {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background: #A0A0B0;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}

.status-dot.active {
  background: #00B894;
}

.pulse-ring {
  position: absolute;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  border: 2px solid #00B894;
  animation: pulse 1.5s ease-out infinite;
  top: 0;
  left: 0;
}

@keyframes pulse {
  0% {
    transform: scale(0.8);
    opacity: 1;
  }
  100% {
    transform: scale(1.5);
    opacity: 0;
  }
}

.status-info {
  display: flex;
  flex-direction: column;
}

.status-label {
  color: #FFFFFF;
  font-weight: 600;
  font-size: 14px;
}

.status-detail {
  color: #A0A0B0;
  font-size: 12px;
  font-family: 'Roboto Mono', monospace;
}

.section-title {
  color: #FFFFFF;
  font-size: 18px;
  font-weight: 700;
  margin: 0;
}

.exercises-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
  gap: 16px;
}

.exercise-card {
  --accent-color: #6C5CE7;
  background: #16213E;
  border-radius: 16px;
  margin: 0;
  border: 2px solid transparent;
  transition: all 0.3s ease;
}

.exercise-card:active {
  transform: scale(0.95);
  border-color: var(--accent-color);
}

.exercise-card ion-card-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  padding: 20px 16px;
}

.exercise-icon-container {
  width: 56px;
  height: 56px;
  border-radius: 50%;
  background: linear-gradient(135deg, var(--accent-color), color-mix(in srgb, var(--accent-color) 70%, black));
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 12px;
}

.exercise-icon {
  font-size: 28px;
  color: #FFFFFF;
}

.exercise-card ion-card-title {
  color: #FFFFFF;
  font-size: 14px;
  font-weight: 700;
}

.exercise-card ion-card-subtitle {
  color: #A0A0B0;
  font-size: 11px;
  margin-top: 4px;
}

.stats-section {
  margin-top: 8px;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 16px;
  margin-top: 12px;
}

.stat-card {
  background: #16213E;
  border-radius: 16px;
  padding: 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
}

.stat-card ion-icon {
  font-size: 32px;
  color: #6C5CE7;
}

.stat-value {
  font-size: 28px;
  font-weight: 700;
  color: #FFFFFF;
  font-family: 'Roboto Mono', monospace;
}

.stat-label {
  font-size: 12px;
  color: #A0A0B0;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.info-card {
  background: #16213E;
  border-radius: 16px;
  padding: 16px;
  display: flex;
  gap: 12px;
  align-items: flex-start;
}

.info-icon {
  font-size: 24px;
  color: #00CEC9;
  flex-shrink: 0;
}

.info-card p {
  color: #A0A0B0;
  font-size: 13px;
  line-height: 1.5;
  margin: 0;
}

.info-card strong {
  color: #FFFFFF;
}

ion-content {
  --background: #1A1A2E;
}

ion-toolbar {
  --background: #16213E;
}
</style>