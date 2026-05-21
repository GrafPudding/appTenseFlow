# TenseFlow - On-Device AI Face Detection App

Real-time face detection app powered by TensorFlow.js, running 100% on-device without internet connection.

## On-Device AI

Built with **BlazeFace** (TensorFlow.js) for real-time face detection directly in the device's WebView — no cloud dependency for inference.

| Feature | Detail |
|---------|--------|
| Model | BlazeFace (MediaPipe) |
| Type | Face detection w/ 6 landmarks |
| Model size | ~3.2MB (quantized, loaded once) |
| Runtime | TensorFlow.js WebGL backend |
| Inference | <50ms on mid-range devices |

##  Stack

| Layer | Technology |
|-------|-----------|
| Framework | Vue 3 (Composition API) + Ionic 7 |
| Mobile Bridge | Capacitor 5 |
| AI Engine | TensorFlow.js 4.x + BlazeFace |
| Backend | WebGL (GPU-accelerated) |
| Build | Vite 8 |

##  Quick Start

```bash
# Install dependencies
npm install

# Run in browser (dev)
npm run dev

# Build for production
npm run build

# Sync to Android
npm run cap:sync

# Build APK
cd android
./gradlew assembleDebug
```

## Features

- **Real-time face detection** with bounding box
- **Facial landmarks** (eyes, nose, mouth) overlay
- **Performance metrics** (FPS, inference latency) live display
- **Fully offline** — no internet required after initial model load
- **Native app** look with Ionic dark theme

## Project Structure

```
src/
├── composables/
│   ├── useCamera.ts        # Camera access (HTML MediaStream)
│   └── useFaceDetection.ts # BlazeFace model loading & inference
├── views/
│   ├── HomePage.vue        # Home screen with status & start
│   ├── DetectionPage.vue   # Camera + AI detection loop
│   └── SettingsPage.vue    # App info & settings
├── router/
│   └── index.ts            # Vue Router configuration
├── App.vue                 # Root Ionic component
└── main.ts                 # App entry point
```

## Performance Targets

| Metric | Target | Acceptable |
|--------|--------|------------|
| FPS | 24+ | 15+ |
| Inference latency | <50ms | <100ms |
| Model load time | <3s | <5s |
| APK size | <30MB | <50MB |
