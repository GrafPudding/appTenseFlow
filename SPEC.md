# TenseFlow - On-Device AI Fitness App

## 1. Concept & Vision

**TenseFlow** es una aplicació d'entrenament intel·ligent que utilitza **PoseNet** (TensorFlow.js) per detectar postures humanes en temps real a través de la càmera del dispositiu. L'app analitza la forma del cos durant exercicis com flexions, squats i planques, proporcionant feedback visual i estadístiques de rendiment -tot 100% offline, sense dependència del núvol.

L'experiència és immediata: l'usuari obre l'app, activa la càmera, i comença a fer exercici mentre la IA detecta i mostra els punts corporals en temps real.

## 2. Design Language

### Aesthetic Direction
Estil **fitness premium** inspirat en apps com Nike Training Club. Interfície fosca amb accents de color dinamitzadors que representen energia i moviment.

### Color Palette
- **Primary**: `#6C5CE7` (Purple Energy)
- **Secondary**: `#00CEC9` (Teal Active)
- **Accent**: `#FDCB6E` (Yellow Alert/Highlight)
- **Background**: `#1A1A2E` (Dark Navy)
- **Surface**: `#16213E` (Darker Surface)
- **Text Primary**: `#FFFFFF`
- **Text Secondary**: `#A0A0B0`
- **Success**: `#00B894`
- **Warning**: `#E17055`

### Typography
- **Headings**: Inter Bold (700)
- **Body**: Inter Regular (400)
- **Numbers/Stats**: SF Mono / Roboto Mono

### Spatial System
- Base unit: 8px
- Padding containers: 16px / 24px
- Border radius: 12px (cards), 24px (buttons), 50% (avatars)

### Motion Philosophy
- Transicions suaus de 300ms ease-out per canvis d'estat
- Animacions de detecció amb ripple effect
- Skeleton loading per a càrrega del model IA

## 3. Layout & Structure

### Pantalla Principal (Home)
```
┌─────────────────────────┐
│  🔔  TenseFlow    [⚙️]  │  Header amb icones
├─────────────────────────┤
│                         │
│    ┌───────────────┐    │
│    │   CAMERA      │    │  Vista càmera amb
│    │   PREVIEW     │    │  overlay de skeletons
│    │   + Canvas    │    │
│    └───────────────┘    │
│                         │
│  ┌─────────────────────┐│
│  │ Detecció: Activa    ││  Status bar IA
│  │ FPS: 24 | Lat: 42ms ││
│  └─────────────────────┘│
│                         │
│  ┌───┐ ┌───┐ ┌───┐      │
│  │🏋️│ │🏃│ │🧘│      │  Quick exercises
│  └───┘ └───┘ └───┘      │
│                         │
│  ┌─────────────────────┐│
│  │  Sessions avui: 2   ││  Stats card
│  │  Calories: 145      ││
│  └─────────────────────┘│
└─────────────────────────┘
```

### Pantalla de Detecció (Camera + AI)
```
┌─────────────────────────┐
│  ←  Entrenament         │
├─────────────────────────┤
│ ┌─────────────────────┐ │
│ │                     │ │
│ │   VIDEO FEED        │ │  Camera amb
│ │   + SKELETON        │ │  overlay de
│ │   + BOUNDING BOX    │ │  punts corporals
│ │                     │ │
│ └─────────────────────┘ │
│                         │
│  Repeticions: 12        │  Counter animat
│  Forma: ⭐⭐⭐⭐☆        │  Qualitat posture
│                         │
│  ┌─────────────────────┐│
│  │  🟢 Cames: Correcte ││  Feedback en temps
│  │  🟡 Esquena: Baix   ││
│  └─────────────────────┘│
└─────────────────────────┘
```

## 4. Features & Interactions

### Core Features

#### F1: Detecció de Postura en Temps Real
- Utilitza **PoseNet** (MobileNet backbone) per detectar 17 punts corporals
- Freqüència objectiu: 15-30 FPS en dispositius mitjans
- Confidence threshold: 0.50 per a keypoints
- Display mode: Single-pose (1 persona)

#### F2: Comptador de Repeticions
- Detecta angles articulares (colze, genoll, espatlla)
- Estat: `up` / `down` per a cada exercici
- Transició d'estat quan l'angle creua el llindar
- Feedback haptic en completar repetició

#### F3: Anàlisi de Qualitat
- Avalua alineació de columna (per flexions)
- Detecta "shaking" o moviment excessiu
- Puntuació 1-5 baseda en múltiples factors

#### F4: Modes d'Exercici
- **Flexions**: Detecció de colzes i espatlles
- **Squats**: Detecció de genolls i malucs
- **Plank**: Detecció de línia cadera-espatlla

### Interaccions

| Element | Acció | Resposta |
|---------|-------|----------|
| Card exercici | Tap | Navega a pantalla de detecció |
| Camera preview | Long press | Canvia càmera (front/back) |
| Rep counter | Tap | Reseteja comptador |
| Settings | Tap | Obri panel de configuració |
| Permission denied | Retry button | Demana permís càmera |

### Estats

- **Loading Model**: Skeleton amb missatge "Carregant model IA..."
- **Camera Permission**: Pantalla de permís amb instruccions
- **Detecting**: Overlay actiu amb FPS counter
- **Exercise Complete**: Celebració amb estadístiques

## 5. Component Inventory

### PoseCamera.vue
Vista de càmera amb canvas overlay per a skeleton.
- Props: `facingMode`, `exerciseType`
- Events: `@pose-detected`, `@error`
- Estats: loading, active, paused, error

### PoseOverlay.vue
Dibuixa els 17 keypoints i connexions del cos.
- Props: `keypoints`, `skeletonColor`, `lineWidth`
- Utilitza Canvas 2D API

### ExerciseCard.vue
Targeta per seleccionar tipus d'exercici.
- Props: `title`, `icon`, `difficulty`
- Estats: default, selected, disabled

### RepetitionCounter.vue
Comptador animat de repeticions.
- Props: `count`, `target`
- Animació: Scale bounce en increment

### QualityIndicator.vue
Barra de qualitat amb estrelles o percentatge.
- Props: `score` (0-5)
- Colors: vermell → groc → verd

### StatsCard.vue
Targeta amb estadístiques de sessió.
- Props: `label`, `value`, `icon`

## 6. Technical Approach

### Stack
- **Framework**: Vue 3 (Composition API) + Ionic 7
- **Mobile Bridge**: Capacitor 5
- **AI Engine**: TensorFlow.js 4.x amb PoseNet
- **Build**: Vite

### TensorFlow.js Model

```
Model: PoseNet (MobileNet v1 backbone)
├── Input: Image/video frame (257x257x3)
├── Output: Keypoints (17 punts)
│   ├── nose, leftEye, rightEye, leftEar, rightEar
│   ├── leftShoulder, rightShoulder
│   ├── leftElbow, rightElbow
│   ├── leftWrist, rightWrist
│   ├── leftHip, rightHip
│   ├── leftKnee, rightKnee
│   └── leftAnkle, rightAnkle
└── Connections: 15 skeleton lines

Performance:
├── Model size: ~3.2MB (quantized)
├── Inference: ~20-50ms (device dependent)
└── FPS target: 15-30 FPS
```

### Camera Pipeline

```
┌──────────────┐
│ getUserMedia  │ ← Sol·licita accés càmera
└──────┬───────┘
       ▼
┌──────────────┐
│ HTMLVideoElem │ ← Reprodueix stream
└──────┬───────┘
       ▼
┌──────────────┐
│ requestAnimFr│ ← Bucle de detecció
└──────┬───────┘
       ▼
┌──────────────┐
│ tf.browser   │ ← Passa frame a tensor
│ .fromPixels  │
└──────┬───────┘
       ▼
┌──────────────┐
│ posenet      │ ← Inferència PoseNet
│ .estimateSinglePose│
└──────┬───────┘
       ▼
┌──────────────┐
│ Canvas Draw  │ ← Dibuixa skeleton
└──────┬───────┘
       ▼
┌──────────────┐
│ Rep Counter  │ ← Calcula repeticions
│ & Quality    │
└──────────────┘
```

### Capacitor Configuration

```json
// capacitor.config.ts
{
  "plugins": {
    "Camera": {
      "permissions": ["camera"]
    }
  }
}
```

### Permisos Android

```xml
<!-- AndroidManifest.xml -->
<uses-permission android:name="android.permission.CAMERA" />
<uses-feature android:name="android.hardware.camera" android:required="true" />
```

## 7. File Structure

```
tenseflow/
├── src/
│   ├── components/
│   │   ├── PoseCamera.vue
│   │   ├── PoseOverlay.vue
│   │   ├── ExerciseCard.vue
│   │   ├── RepetitionCounter.vue
│   │   ├── QualityIndicator.vue
│   │   └── StatsCard.vue
│   ├── composables/
│   │   ├── usePoseDetection.ts
│   │   ├── useExerciseDetector.ts
│   │   └── useCamera.ts
│   ├── views/
│   │   ├── HomePage.vue
│   │   ├── DetectionPage.vue
│   │   └── SettingsPage.vue
│   ├── services/
│   │   └── poseService.ts
│   ├── types/
│   │   └── pose.ts
│   └── main.ts
├── public/
│   └── models/  (TensorFlow model files si cal)
├── android/
├── capacitor.config.ts
├── package.json
└── SPEC.md
```

## 8. Performance Targets

| Mètrica | Objectiu | Acceptable |
|---------|----------|------------|
| FPS | 24+ | 15+ |
| Latència inferència | <50ms | <100ms |
| Temps càrrega model | <3s | <5s |
| Memòria RAM | <300MB | <500MB |
| APK size | <30MB | <50MB |
