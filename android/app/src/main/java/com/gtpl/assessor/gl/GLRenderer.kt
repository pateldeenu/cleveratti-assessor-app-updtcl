package com.gtpl.assessor.gl

import android.content.Context
import android.opengl.EGL14
import android.opengl.GLES20
import android.opengl.GLSurfaceView
import com.gtpl.assessor.camera.CameraStreamConfig
import com.gtpl.assessor.camera.DualCameraController
import com.gtpl.assessor.encoder.EglRecorder
import com.gtpl.assessor.encoder.VideoEncoder
import javax.microedition.khronos.egl.EGLConfig
import javax.microedition.khronos.opengles.GL10

class GLRenderer(
    private val context: Context,
    private val callbacks: Callbacks,
) : GLSurfaceView.Renderer {

    interface Callbacks {
        fun requestRender()
        fun onError(message: String)
        fun onRecordingStateChanged(state: String, path: String?)
    }

    private lateinit var drawer: FrameDrawer
    private lateinit var controller: DualCameraController

    private var encoder: VideoEncoder? = null
    private var eglRecorder: EglRecorder? = null
    private var isRecording = false
    private var recordingPath: String? = null
    private var viewWidth = 0
    private var viewHeight = 0
    private var lastEncodedFrameNs = 0L

    override fun onSurfaceCreated(gl: GL10?, config: EGLConfig?) {
        try {
            GLES20.glClearColor(0f, 0f, 0f, 1f)
            drawer = FrameDrawer(context)
            drawer.setFrameAvailableListener { callbacks.requestRender() }
            controller = DualCameraController(context, object : DualCameraController.Listener {
                override fun onConfigured(backConfig: CameraStreamConfig, frontConfig: CameraStreamConfig?) {
                    drawer.setCameraConfigs(backConfig, frontConfig)
                    callbacks.requestRender()
                }

                override fun onError(message: String, throwable: Throwable?) {
                    callbacks.onError(message)
                }
            })

            controller.start(
                drawer.getBackSurfaceTexture(),
                drawer.getFrontSurfaceTexture(),
            )
        } catch (e: Exception) {
            callbacks.onError(e.message ?: "Failed to create OpenGL surface.")
        }
    }

    override fun onSurfaceChanged(gl: GL10?, width: Int, height: Int) {
        viewWidth = width
        viewHeight = height
        GLES20.glViewport(0, 0, width, height)
    }

    override fun onDrawFrame(gl: GL10?) {
        try {
            val frameUpdated = drawer.update()
            GLES20.glBindFramebuffer(GLES20.GL_FRAMEBUFFER, 0)
            drawer.draw(viewWidth, viewHeight)

            val currentEncoder = encoder
            if (isRecording && currentEncoder != null) {
                currentEncoder.drain(false)
            }

            val recorder = eglRecorder
            val nowNs = System.nanoTime()
            val shouldEncodeFrame =
                frameUpdated &&
                    (lastEncodedFrameNs == 0L || nowNs - lastEncodedFrameNs >= ENCODER_FRAME_INTERVAL_NS)
            if (isRecording && recorder != null && currentEncoder != null && shouldEncodeFrame) {
                val currentDisplay = EGL14.eglGetCurrentDisplay()
                val currentDrawSurface = EGL14.eglGetCurrentSurface(EGL14.EGL_DRAW)
                val currentReadSurface = EGL14.eglGetCurrentSurface(EGL14.EGL_READ)
                val currentContext = EGL14.eglGetCurrentContext()

                recorder.makeCurrent()
                GLES20.glBindFramebuffer(GLES20.GL_FRAMEBUFFER, 0)
                GLES20.glClearColor(0f, 0f, 0f, 1f)
                drawer.draw(currentEncoder.width, currentEncoder.height)
                GLES20.glFlush()
                recorder.setTime(nowNs)
                recorder.swapBuffers()
                currentEncoder.drain(false)
                lastEncodedFrameNs = nowNs

                EGL14.eglMakeCurrent(
                    currentDisplay,
                    currentDrawSurface,
                    currentReadSurface,
                    currentContext,
                )
            }
        } catch (e: Exception) {
            callbacks.onError(e.message ?: "Rendering failed.")
        }
    }

    fun startRecording(path: String) {
        if (isRecording) {
            return
        }

        try {
            val encodeSize = chooseRecordingSize()
            encoder = VideoEncoder(encodeSize.first, encodeSize.second, path)
            val surface = encoder!!.start()
            eglRecorder = EglRecorder(surface)
            eglRecorder!!.init(EGL14.eglGetCurrentContext())
            isRecording = true
            recordingPath = path
            lastEncodedFrameNs = 0L
            callbacks.requestRender()
            callbacks.onRecordingStateChanged("started", path)
        } catch (e: Exception) {
            callbacks.onError(e.message ?: "Failed to start recording.")
        }
    }

    fun stopRecording() {
        if (!isRecording) {
            return
        }

        try {
            encoder?.drain(true)
            encoder?.stop()
            eglRecorder?.release()
            encoder = null
            eglRecorder = null
            isRecording = false
            lastEncodedFrameNs = 0L
            callbacks.onRecordingStateChanged("stopped", recordingPath)
            recordingPath = null
        } catch (e: Exception) {
            callbacks.onError(e.message ?: "Failed to stop recording.")
        }
    }

    fun release() {
        stopRecording()
        if (::controller.isInitialized) {
            controller.stop()
        }
        if (::drawer.isInitialized) {
            drawer.release()
        }
    }

    private fun makeEven(value: Int): Int {
        return if (value % 2 == 0) value else value - 1
    }

    private fun chooseRecordingSize(): Pair<Int, Int> {
        val targetPortrait = if (viewHeight >= viewWidth) {
            Pair(720, 1280)
        } else {
            Pair(1280, 720)
        }

        val maxWidth = makeEven(if (viewWidth > 0) viewWidth else targetPortrait.first)
        val maxHeight = makeEven(if (viewHeight > 0) viewHeight else targetPortrait.second)

        return Pair(
            minOf(targetPortrait.first, maxWidth),
            minOf(targetPortrait.second, maxHeight),
        )
    }

    companion object {
        private const val ENCODER_FRAME_INTERVAL_NS = 33_333_333L
    }
}
