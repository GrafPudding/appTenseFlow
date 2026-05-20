<template>
  <ion-page>
    <ion-header>
      <ion-toolbar color="dark">
        <ion-title>Configuració</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content :fullscreen="true" class="ion-padding">
      <div class="settings-container">
        <div class="app-info">
          <div class="app-logo">
            <ion-icon :icon="flashOutline" />
          </div>
          <h1 class="app-name">TenseFlow</h1>
          <p class="app-version">Versió 1.0.0</p>
        </div>

        <div class="settings-section">
          <h3 class="section-title">IA Local</h3>

          <div class="setting-item">
            <div class="setting-info">
              <ion-icon :icon="hardwareChipOutline" />
              <div class="setting-text">
                <span class="setting-label">Model</span>
                <span class="setting-value">MoveNet Lightning</span>
              </div>
            </div>
          </div>

          <div class="setting-item">
            <div class="setting-info">
              <ion-icon :icon="speedometerOutline" />
              <div class="setting-text">
                <span class="setting-label">FPS Objectiu</span>
                <span class="setting-value">24 FPS</span>
              </div>
            </div>
          </div>

          <div class="setting-item">
            <div class="setting-info">
              <ion-icon :icon="serverOutline" />
              <div class="setting-text">
                <span class="setting-label">Execució</span>
                <span class="setting-value">100% Offline</span>
              </div>
            </div>
          </div>
        </div>

        <div class="settings-section">
          <h3 class="section-title">Sobre l'App</h3>

          <div class="about-card">
            <p>
              TenseFlow és una aplicació d'entrenament intel·ligent que utilitza
              <strong>Intel·ligència Artificial local</strong> per detectar postures
              en temps real sense necessitat de connexió a Internet.
            </p>
            <p>
              Utilitza TensorFlow.js amb MoveNet per a la detecció de esquelets
              humans directament al dispositiu.
            </p>
          </div>
        </div>

        <div class="credits">
          <p>Desenvolupat per a pràctica DAM</p>
          <p>Ionic + Vue + Capacitor + TensorFlow.js</p>
        </div>
      </div>
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import {
  IonPage, IonHeader, IonToolbar, IonTitle, IonContent, IonIcon
} from '@ionic/vue'
import {
  flashOutline, hardwareChipOutline, speedometerOutline, serverOutline
} from 'ionicons/icons'
</script>

<style scoped>
.settings-container {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.app-info {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  padding: 32px 0;
}

.app-logo {
  width: 80px;
  height: 80px;
  border-radius: 20px;
  background: linear-gradient(135deg, #6C5CE7, #00CEC9);
  display: flex;
  align-items: center;
  justify-content: center;
}

.app-logo ion-icon {
  font-size: 40px;
  color: #FFFFFF;
}

.app-name {
  font-size: 28px;
  font-weight: 700;
  color: #FFFFFF;
  margin: 0;
}

.app-version {
  font-size: 14px;
  color: #A0A0B0;
  margin: 0;
}

.settings-section {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.section-title {
  font-size: 14px;
  font-weight: 600;
  color: #A0A0B0;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  margin: 0 0 8px 0;
}

.setting-item {
  background: #16213E;
  border-radius: 12px;
  padding: 16px;
}

.setting-info {
  display: flex;
  align-items: center;
  gap: 12px;
}

.setting-info ion-icon {
  font-size: 24px;
  color: #6C5CE7;
}

.setting-text {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.setting-label {
  font-size: 14px;
  color: #FFFFFF;
  font-weight: 600;
}

.setting-value {
  font-size: 12px;
  color: #A0A0B0;
}

.about-card {
  background: #16213E;
  border-radius: 12px;
  padding: 16px;
}

.about-card p {
  color: #A0A0B0;
  font-size: 14px;
  line-height: 1.6;
  margin: 0 0 12px 0;
}

.about-card p:last-child {
  margin: 0;
}

.about-card strong {
  color: #00CEC9;
}

.credits {
  text-align: center;
  padding: 24px 0;
  color: #A0A0B0;
  font-size: 12px;
}

.credits p {
  margin: 4px 0;
}

ion-content {
  --background: #1A1A2E;
}

ion-toolbar {
  --background: #16213E;
}
</style>