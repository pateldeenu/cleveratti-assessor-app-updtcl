package com.gtpl.assessor.camera

import android.Manifest
import android.content.Context
import android.content.pm.PackageManager
import android.graphics.SurfaceTexture
import android.hardware.camera2.CameraCaptureSession
import android.hardware.camera2.CameraDevice
import android.hardware.camera2.CameraManager
import android.hardware.camera2.CaptureRequest
import android.os.Handler
import android.os.HandlerThread
import android.view.Surface
import androidx.core.content.ContextCompat
import java.util.concurrent.ConcurrentHashMap

class DualCameraController(
    private val context: Context,
    private val listener: Listener,
) {

    interface Listener {
        fun onConfigured(backConfig: CameraStreamConfig, frontConfig: CameraStreamConfig?)
        fun onError(message: String, throwable: Throwable? = null)
    }

    private val manager = context.getSystemService(Context.CAMERA_SERVICE) as CameraManager
    private val sessions = ConcurrentHashMap<String, CameraSession>()
    private var cameraThread: HandlerThread? = null
    private var cameraHandler: Handler? = null
    @Volatile
    private var isStarted = false

    fun start(back: SurfaceTexture, front: SurfaceTexture) {
        if (isStarted) {
            return
        }

        if (ContextCompat.checkSelfPermission(context, Manifest.permission.CAMERA) != PackageManager.PERMISSION_GRANTED) {
            listener.onError("Camera permission is required before opening the dual camera preview.")
            return
        }

        val concurrentPair = CameraUtils.resolveConcurrentBackFrontPair(manager)
        val backConfig = concurrentPair?.first
            ?: CameraUtils.resolveCamera(manager, android.hardware.camera2.CameraCharacteristics.LENS_FACING_BACK)
            ?: run {
                listener.onError("No back camera preview stream is available on this device.")
                return
            }
        val frontConfig = concurrentPair?.second

        startThreadIfNeeded()
        isStarted = true
        listener.onConfigured(backConfig, frontConfig)
        openCamera(backConfig, back)
        if (frontConfig != null) {
            openCamera(frontConfig, front)
        } else {
            listener.onError("Dual front+back camera preview is not supported on this device. Falling back to back camera only.")
        }
    }

    fun stop() {
        isStarted = false
        sessions.values.forEach { session ->
            runCatching { session.captureSession?.stopRepeating() }
            runCatching { session.captureSession?.close() }
            runCatching { session.device?.close() }
            runCatching { session.surface.release() }
        }
        sessions.clear()
        cameraThread?.quitSafely()
        cameraThread = null
        cameraHandler = null
    }

    private fun startThreadIfNeeded() {
        if (cameraThread != null) {
            return
        }

        cameraThread = HandlerThread("DualCameraController").also { thread ->
            thread.start()
            cameraHandler = Handler(thread.looper)
        }
    }

    private fun openCamera(config: CameraStreamConfig, surfaceTexture: SurfaceTexture) {
        surfaceTexture.setDefaultBufferSize(config.previewSize.width, config.previewSize.height)
        val surface = Surface(surfaceTexture)
        sessions[config.cameraId] = CameraSession(config = config, surface = surface)

        manager.openCamera(config.cameraId, object : CameraDevice.StateCallback() {
            override fun onOpened(camera: CameraDevice) {
                val session = sessions[config.cameraId] ?: return
                session.device = camera
                createPreviewSession(session)
            }

            override fun onDisconnected(camera: CameraDevice) {
                listener.onError("Camera ${config.cameraId} disconnected.")
                camera.close()
                sessions.remove(config.cameraId)?.surface?.release()
            }

            override fun onError(camera: CameraDevice, error: Int) {
                listener.onError("Failed to open camera ${config.cameraId}. Camera2 error code: $error")
                camera.close()
                sessions.remove(config.cameraId)?.surface?.release()
            }
        }, cameraHandler)
    }

    private fun createPreviewSession(cameraSession: CameraSession) {
        val camera = cameraSession.device ?: return
        val requestBuilder = camera.createCaptureRequest(CameraDevice.TEMPLATE_PREVIEW).apply {
            addTarget(cameraSession.surface)
            set(CaptureRequest.CONTROL_AF_MODE, CaptureRequest.CONTROL_AF_MODE_CONTINUOUS_VIDEO)
        }

        camera.createCaptureSession(
            listOf(cameraSession.surface),
            object : CameraCaptureSession.StateCallback() {
                override fun onConfigured(captureSession: CameraCaptureSession) {
                    cameraSession.captureSession = captureSession
                    captureSession.setRepeatingRequest(requestBuilder.build(), null, cameraHandler)
                }

                override fun onConfigureFailed(captureSession: CameraCaptureSession) {
                    listener.onError("Failed to configure capture session for camera ${cameraSession.config.cameraId}.")
                }
            },
            cameraHandler,
        )
    }
}
