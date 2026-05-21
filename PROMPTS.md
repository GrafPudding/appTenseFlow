# PROMPTS.md — TenseFlow

## Resum del Projecte

**TenseFlow** és una aplicació mòbil híbrida (Ionic/Vue + Capacitor) que utilitza **TensorFlow.js** amb el model **BlazeFace** per detectar rostres humans en temps real a través de la càmera del dispositiu. Tota la inferència es realitza localment, sense connexió a Internet.

---

## 1. Model TensorFlow.js Escollit

| Propietat | Valor |
|-----------|-------|
| Model | **BlazeFace** (MediaPipe) |
| Tipus | Face detection amb 6 landmarks facials |
| Mida | ~3.2 MB (quantized, carregat una vegada) |
| Backend | WebGL (GPU-accelerat) |
| Outputs | Bounding box + coordenades d'ulls, nas, boca |
| Llibreria | `@tensorflow-models/blazeface` + `@tensorflow/tfjs` |

**Per què BlazeFace?**
- Optimitzat per a dispositius mòbils (inferència <50ms)
- No requereix connexió a Internet per a la inferència
- Compatible amb Ionic WebView sense plugins natius especials
- Proporciona landmarks facials que permeten feedback visual ric

---

## 2. Prompts Utilitzats per Integrar TensorFlow.js amb Vue

### Prompt 1: Creació del projecte base
```
Create an Ionic Vue 3 project with Capacitor 5 support.
The app should use TensorFlow.js with the BlazeFace model for real-time
face detection through the camera. The project must be fully offline
(on-device AI). Use TypeScript, Composition API, and a dark theme.
```

### Prompt 2: Composable de detecció facial
```
Create a Vue composable (useFaceDetection.ts) that:
- Loads the BlazeFace model via @tensorflow-models/blazeface
- Uses WebGL as the TensorFlow.js backend
- Implements an estimateFaces function that accepts HTMLVideoElement
- Tracks FPS and inference latency
- Handles loading state, readiness, and errors
- Cleans up the model on component unmount
```

### Prompt 3: Composable de càmera
```
Create a Vue composable (useCamera.ts) that:
- Requests camera access via navigator.mediaDevices.getUserMedia
- Accepts a video element reference to display the camera stream
- Mirrors the front camera horizontally
- Tracks active state and error state
- Provides startCamera, stopCamera, and switchCamera functions
- Cleans up the stream on unmount
```

### Prompt 4: Vista de detecció (DetectionPage)
```
Create an Ionic Vue page (DetectionPage.vue) that:
- Shows the camera preview full-width with aspect ratio 4:3
- Overlays a canvas on top of the video for drawing face bounding boxes
- Has a Start/Stop button to toggle the detection loop using requestAnimationFrame
- Shows real-time FPS, inference latency, and detection count
- Uses the canvas 2D API to draw landmarks (eyes, nose, mouth)
- Displays a 'model loading' overlay while the AI model initializes
- Shows a 'camera permission denied' error with a retry button
- Uses a dark theme (#1A1A2E background) with purple/teal accents
```

### Prompt 5: Bucle de detecció en temps real
```
Implement a real-time detection loop using requestAnimationFrame.
Each frame should:
1. Pass the current video frame to BlazeFace's estimateFaces
2. If a face is detected, draw the bounding box in #6C5CE7
3. Draw 6 facial landmarks as teal (#00CEC9) circles
4. Connect landmarks with yellow (#FDCB6E) lines for eye-nose-mouth triangulation
5. Update FPS counter and inference stats
6. Never block the UI — detection is async
```

### Prompt 6: Pantalla d'inici (HomePage)
```
Create a home page (HomePage.vue) that shows:
- A status card showing whether the AI model is loaded (with animated pulse ring)
- Live FPS and latency when the model is ready
- Exercise cards (face detection, emotion detection, object detection)
- Session stats (sessions today, estimated calories)
- A dark theme info card explaining the AI runs 100% offline
- Ionic tab navigation with Home and Settings tabs
```

### Prompt 7: Pantalla de configuració (SettingsPage)
```
Create a settings page (SettingsPage.vue) that shows:
- App logo and version
- AI model info (BlazeFace, 24 FPS target, 100% offline)
- About section explaining the TensorFlow.js + Capacitor architecture
- Dark theme consistent with the rest of the app
```

### Prompt 8: Configuració de Capacitor i build Android
```
Configure Capacitor 5 for Android with:
- Camera permission in AndroidManifest.xml
- ANDROID_HOME environment variable setup
- Gradle build configuration
- Web assets sync with 'npx cap sync android'
- APK generation with './gradlew assembleDebug'
```

---

## 3. Captures de Pantalla

*[Les captures s'adjunten al document PDF]*

- **HomePage**: Pantalla principal amb l'estat de la IA i targetes d'exercicis
- **DetectionPage**: Càmera amb bounding box facial i landmarks
- **SettingsPage**: Informació del model i configuració
- **APK Install**: Captura de l'APK instal·lat al dispositiu

---

## 4. Errors Trobats i Solucions

| Error | Causa | Solució |
|-------|-------|---------|
| `MISSING_EXPORT "Pose"` | Incompatibilitat de bundling amb `@tensorflow-models/pose-detection` | Canviar a `@tensorflow-models/blazeface` |
| `MISSING_EXPORT "FaceDetection"` | Incompatibilitat amb `@tensorflow-models/face-detection` | Canviar a `@tensorflow-models/blazeface` (més estable) |
| `invalid source release: 21` | JDK 17 insuficient per Capacitor 8 | Instal·lar JDK 21 |
| `SDK location not found` | ANDROID_HOME no configurat | Definir variable d'entorn ANDROID_HOME |
| `Dependency requires JVM 11` | Java 8 al PATH | Actualitzar JAVA_HOME i PATH a JDK 21 |

---

## 5. Arquitectura del Codi

```
tenseflow/
├── src/
│   ├── composables/
│   │   ├── useCamera.ts          # Accés a la càmera (MediaStream API)
│   │   └── useFaceDetection.ts   # Càrrega del model + inferència
│   ├── views/
│   │   ├── HomePage.vue          # Pantalla principal
│   │   ├── DetectionPage.vue     # Càmera + detecció en temps real
│   │   └── SettingsPage.vue      # Configuració i info
│   ├── router/
│   │   └── index.ts              # Rutes amb Ionic tabs
│   ├── App.vue                   # Component arrel Ionic
│   └── main.ts                   # Entry point
├── android/                      # Projecte Android natiu (Capacitor)
├── capacitor.config.ts
├── SPEC.md
├── PROMPTS.md
└── README.md
```
