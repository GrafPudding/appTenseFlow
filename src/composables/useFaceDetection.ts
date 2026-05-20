import { ref, onUnmounted } from 'vue'
import * as blazeface from '@tensorflow-models/blazeface'
import * as tf from '@tensorflow/tfjs'

let model: any = null

export function useFaceDetection() {
  const isLoading = ref(false)
  const isReady = ref(false)
  const error = ref<string | null>(null)
  const fps = ref(0)
  const lastInferenceTime = ref(0)

  const loadModel = async () => {
    if (model) return

    isLoading.value = true
    error.value = null

    try {
      await tf.setBackend('webgl')
      await tf.ready()
      model = await blazeface.load()
      isReady.value = true
    } catch (e) {
      error.value = e instanceof Error ? e.message : 'Failed to load model'
      console.error('Face detection error:', e)
    } finally {
      isLoading.value = false
    }
  }

  const detectFaces = async (input: HTMLVideoElement | HTMLCanvasElement | ImageData): Promise<any[] | null> => {
    if (!model) return null

    const startTime = performance.now()

    try {
      const faces = await model.estimateFaces(input, false)
      const inferenceTime = performance.now() - startTime
      lastInferenceTime.value = Math.round(inferenceTime)
      fps.value = Math.round(1000 / inferenceTime)

      return faces.length > 0 ? faces : null
    } catch (e) {
      console.error('Detection error:', e)
      return null
    }
  }

  const dispose = () => {
    if (model) {
      model.dispose()
      model = null
      isReady.value = false
    }
  }

  onUnmounted(() => {
    dispose()
  })

  return {
    isLoading,
    isReady,
    error,
    fps,
    lastInferenceTime,
    loadModel,
    detectFaces,
    dispose
  }
}