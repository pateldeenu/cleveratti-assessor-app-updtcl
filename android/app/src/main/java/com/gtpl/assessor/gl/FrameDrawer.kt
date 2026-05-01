package com.gtpl.assessor.gl

import android.content.Context
import android.graphics.SurfaceTexture
import android.hardware.camera2.CameraCharacteristics
import android.opengl.GLES20
import android.opengl.Matrix
import android.view.Surface
import android.view.WindowManager
import com.gtpl.assessor.camera.CameraStreamConfig
import kotlin.math.roundToInt

class FrameDrawer(context: Context) {
    private val drawer = ShaderHelper()
    private val backTexture = ExternalTexture()
    private val frontTexture = ExternalTexture()
    private var backConfig: CameraStreamConfig? = null
    private var frontConfig: CameraStreamConfig? = null
    private val windowManager = context.getSystemService(Context.WINDOW_SERVICE) as WindowManager

    init {
        drawer.init()
    }

    fun getBackSurfaceTexture(): SurfaceTexture = backTexture.surfaceTexture
    fun getFrontSurfaceTexture(): SurfaceTexture = frontTexture.surfaceTexture

    fun setFrameAvailableListener(listener: () -> Unit) {
        backTexture.surfaceTexture.setOnFrameAvailableListener {
            backTexture.frameAvailable = true
            listener()
        }
        frontTexture.surfaceTexture.setOnFrameAvailableListener {
            frontTexture.frameAvailable = true
            listener()
        }
    }

    fun setCameraConfigs(backConfig: CameraStreamConfig, frontConfig: CameraStreamConfig?) {
        this.backConfig = backConfig
        this.frontConfig = frontConfig
    }

    fun update(): Boolean {
        val backUpdated = backTexture.updateIfNeeded()
        val frontUpdated = frontTexture.updateIfNeeded()
        return backUpdated || frontUpdated
    }

    fun draw(outputWidth: Int, outputHeight: Int) {
        if (outputWidth <= 0 || outputHeight <= 0) {
            return
        }
        GLES20.glClear(GLES20.GL_COLOR_BUFFER_BIT)
        drawMain(outputWidth, outputHeight)
        drawPip(outputWidth, outputHeight)
    }

    fun release() {
        backTexture.release()
        frontTexture.release()
        drawer.release()
    }

    private fun drawMain(outputWidth: Int, outputHeight: Int) {
        val config = backConfig ?: return
        GLES20.glViewport(0, 0, outputWidth, outputHeight)
        drawer.draw(
            textureId = backTexture.textureId,
            texMatrix = backTexture.texMatrix,
            mvpMatrix = buildAspectFillMatrix(
                inputWidth = config.previewSize.width,
                inputHeight = config.previewSize.height,
                outputWidth = outputWidth,
                outputHeight = outputHeight,
                rotation = previewRotationDegrees(config),
                mirror = false,
            ),
        )
    }

    private fun drawPip(outputWidth: Int, outputHeight: Int) {
        val config = frontConfig ?: return
        val margin = (outputWidth * 0.04f).roundToInt()
        val pipWidth = (outputWidth * 0.30f).roundToInt()
        val pipAspect = rotatedAspectRatio(config)
        val pipHeight = (pipWidth / pipAspect).roundToInt().coerceAtLeast((outputHeight * 0.22f).roundToInt())
        val pipX = outputWidth - pipWidth - margin
        val pipY = margin

        GLES20.glEnable(GLES20.GL_SCISSOR_TEST)
        GLES20.glScissor(pipX, pipY, pipWidth, pipHeight)
        GLES20.glClearColor(0f, 0f, 0f, 1f)
        GLES20.glClear(GLES20.GL_COLOR_BUFFER_BIT)
        GLES20.glDisable(GLES20.GL_SCISSOR_TEST)

        GLES20.glViewport(pipX, pipY, pipWidth, pipHeight)
        drawer.draw(
            textureId = frontTexture.textureId,
            texMatrix = frontTexture.texMatrix,
            mvpMatrix = buildAspectFillMatrix(
                inputWidth = config.previewSize.width,
                inputHeight = config.previewSize.height,
                outputWidth = pipWidth,
                outputHeight = pipHeight,
                rotation = previewRotationDegrees(config),
                mirror = config.lensFacing == CameraCharacteristics.LENS_FACING_FRONT,
            ),
        )
    }

    private fun previewRotationDegrees(config: CameraStreamConfig): Int {
        val displayDegrees = when (windowManager.defaultDisplay.rotation) {
            Surface.ROTATION_90 -> 90
            Surface.ROTATION_180 -> 180
            Surface.ROTATION_270 -> 270
            else -> 0
        }

        val cameraRotation = if (config.lensFacing == CameraCharacteristics.LENS_FACING_FRONT) {
            (config.sensorOrientation + displayDegrees) % 360
        } else {
            (config.sensorOrientation - displayDegrees + 360) % 360
        }

        return cameraRotation
    }

    private fun rotatedAspectRatio(config: CameraStreamConfig): Float {
        return if (config.sensorOrientation % 180 == 0) {
            config.previewSize.width.toFloat() / config.previewSize.height.toFloat()
        } else {
            config.previewSize.height.toFloat() / config.previewSize.width.toFloat()
        }
    }

    private fun buildAspectFillMatrix(
        inputWidth: Int,
        inputHeight: Int,
        outputWidth: Int,
        outputHeight: Int,
        rotation: Int,
        mirror: Boolean,
    ): FloatArray {
        val matrix = FloatArray(16)
        Matrix.setIdentityM(matrix, 0)
        Matrix.rotateM(matrix, 0, -rotation.toFloat(), 0f, 0f, 1f)

        val sourceAspect = if (rotation % 180 == 0) {
            inputWidth.toFloat() / inputHeight.toFloat()
        } else {
            inputHeight.toFloat() / inputWidth.toFloat()
        }
        val targetAspect = outputWidth.toFloat() / outputHeight.toFloat()

        val scaleX: Float
        val scaleY: Float
        if (sourceAspect > targetAspect) {
            scaleX = targetAspect / sourceAspect
            scaleY = 1f
        } else {
            scaleX = 1f
            scaleY = sourceAspect / targetAspect
        }

        Matrix.scaleM(matrix, 0, if (mirror) -scaleX else scaleX, scaleY, 1f)
        return matrix
    }

    private class ExternalTexture {
        val textureId: Int = TextureHelper.createOESTexture()
        val surfaceTexture: SurfaceTexture = SurfaceTexture(textureId)
        val texMatrix: FloatArray = FloatArray(16)
        @Volatile
        var frameAvailable: Boolean = true

        fun updateIfNeeded(): Boolean {
            if (!frameAvailable) {
                return false
            }
            surfaceTexture.updateTexImage()
            surfaceTexture.getTransformMatrix(texMatrix)
            frameAvailable = false
            return true
        }

        fun release() {
            surfaceTexture.release()
            TextureHelper.releaseTexture(textureId)
        }
    }
}
