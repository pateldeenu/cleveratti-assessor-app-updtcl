package com.gtpl.assessor

import android.content.Context
import android.graphics.SurfaceTexture
import android.opengl.GLES11Ext
import android.opengl.GLES20.*
import android.opengl.GLSurfaceView
import android.util.Log
import java.nio.ByteBuffer
import java.nio.ByteOrder
import java.nio.FloatBuffer
import javax.microedition.khronos.egl.EGLConfig
import javax.microedition.khronos.opengles.GL10

class DualCameraRenderer(
    private val context: Context,
    private val glView: GLSurfaceView
) : GLSurfaceView.Renderer {

    var backSurfaceTexture: SurfaceTexture? = null
    var frontSurfaceTexture: SurfaceTexture? = null

    private var backTextureId = 0
    private var frontTextureId = 0

    private lateinit var vertexBuffer: FloatBuffer
    private lateinit var texBuffer: FloatBuffer

    private var program = 0

    private val vertexCoords = floatArrayOf(
        -1f, -1f,
        1f, -1f,
        -1f, 1f,
        1f, 1f
    )

    private val textureCoords = floatArrayOf(
        0f, 1f,
        1f, 1f,
        0f, 0f,
        1f, 0f
    )

    override fun onSurfaceCreated(gl: GL10?, config: EGLConfig?) {

        backTextureId = createOESTexture()
        frontTextureId = createOESTexture()

        backSurfaceTexture = SurfaceTexture(backTextureId)
        frontSurfaceTexture = SurfaceTexture(frontTextureId)

        // 🔥 CRITICAL FIX: Trigger render when frame arrives
        backSurfaceTexture?.setOnFrameAvailableListener {
            glView.requestRender()
            Log.d("GL", "Back frame received")
        }

        frontSurfaceTexture?.setOnFrameAvailableListener {
            glView.requestRender()
            Log.d("GL", "Front frame received")
        }

        vertexBuffer = ByteBuffer.allocateDirect(vertexCoords.size * 4)
            .order(ByteOrder.nativeOrder()).asFloatBuffer()
        vertexBuffer.put(vertexCoords).position(0)

        texBuffer = ByteBuffer.allocateDirect(textureCoords.size * 4)
            .order(ByteOrder.nativeOrder()).asFloatBuffer()
        texBuffer.put(textureCoords).position(0)

        program = createProgram(VERTEX_SHADER, FRAGMENT_SHADER)

        Log.d("GL", "Renderer initialized")
    }

    override fun onSurfaceChanged(gl: GL10?, width: Int, height: Int) {
        glViewport(0, 0, width, height)
    }

    override fun onDrawFrame(gl: GL10?) {

        glClear(GL_COLOR_BUFFER_BIT)

        backSurfaceTexture?.updateTexImage()
        frontSurfaceTexture?.updateTexImage()

        drawTexture(backTextureId) // Full screen
        drawTexture(frontTextureId) // Overlay (simple draw)
    }

    private fun drawTexture(textureId: Int) {

        glUseProgram(program)

        val posHandle = glGetAttribLocation(program, "aPosition")
        val texHandle = glGetAttribLocation(program, "aTexCoord")

        glEnableVertexAttribArray(posHandle)
        glVertexAttribPointer(posHandle, 2, GL_FLOAT, false, 0, vertexBuffer)

        glEnableVertexAttribArray(texHandle)
        glVertexAttribPointer(texHandle, 2, GL_FLOAT, false, 0, texBuffer)

        glActiveTexture(GL_TEXTURE0)
        glBindTexture(GLES11Ext.GL_TEXTURE_EXTERNAL_OES, textureId)

        glDrawArrays(GL_TRIANGLE_STRIP, 0, 4)

        glDisableVertexAttribArray(posHandle)
        glDisableVertexAttribArray(texHandle)
    }

    private fun createOESTexture(): Int {
        val textures = IntArray(1)
        glGenTextures(1, textures, 0)

        glBindTexture(GLES11Ext.GL_TEXTURE_EXTERNAL_OES, textures[0])
        glTexParameterf(GLES11Ext.GL_TEXTURE_EXTERNAL_OES, GL_TEXTURE_MIN_FILTER, GL_LINEAR.toFloat())
        glTexParameterf(GLES11Ext.GL_TEXTURE_EXTERNAL_OES, GL_TEXTURE_MAG_FILTER, GL_LINEAR.toFloat())

        return textures[0]
    }

    private fun loadShader(type: Int, code: String): Int {
        val shader = glCreateShader(type)
        glShaderSource(shader, code)
        glCompileShader(shader)
        return shader
    }

    private fun createProgram(v: String, f: String): Int {
        val vs = loadShader(GL_VERTEX_SHADER, v)
        val fs = loadShader(GL_FRAGMENT_SHADER, f)

        val program = glCreateProgram()
        glAttachShader(program, vs)
        glAttachShader(program, fs)
        glLinkProgram(program)

        return program
    }

    companion object {
        private const val VERTEX_SHADER = """
            attribute vec4 aPosition;
            attribute vec2 aTexCoord;
            varying vec2 vTexCoord;

            void main() {
                gl_Position = aPosition;
                vTexCoord = aTexCoord;
            }
        """

        private const val FRAGMENT_SHADER = """
            #extension GL_OES_EGL_image_external : require
            precision mediump float;

            varying vec2 vTexCoord;
            uniform samplerExternalOES sTexture;

            void main() {
                gl_FragColor = texture2D(sTexture, vTexCoord);
            }
        """
    }
}