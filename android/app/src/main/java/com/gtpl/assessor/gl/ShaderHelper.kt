package com.gtpl.assessor.gl

import android.opengl.GLES11Ext
import android.opengl.GLES20
import java.nio.ByteBuffer
import java.nio.ByteOrder
import java.nio.FloatBuffer

class ShaderHelper {

    private val vertexCoords = floatArrayOf(
        -1f, -1f,
        1f, -1f,
        -1f, 1f,
        1f, 1f,
    )

    private val texCoords = floatArrayOf(
        0f, 1f,
        1f, 1f,
        0f, 0f,
        1f, 0f,
    )

    private lateinit var vertexBuffer: FloatBuffer
    private lateinit var texBuffer: FloatBuffer
    private var program = 0
    private var positionHandle = 0
    private var texCoordHandle = 0
    private var mvpMatrixHandle = 0
    private var texMatrixHandle = 0
    private var samplerHandle = 0

    fun init() {
        vertexBuffer = ByteBuffer.allocateDirect(vertexCoords.size * 4)
            .order(ByteOrder.nativeOrder())
            .asFloatBuffer()
        vertexBuffer.put(vertexCoords).position(0)

        texBuffer = ByteBuffer.allocateDirect(texCoords.size * 4)
            .order(ByteOrder.nativeOrder())
            .asFloatBuffer()
        texBuffer.put(texCoords).position(0)

        val vertexShader = loadShader(
            GLES20.GL_VERTEX_SHADER,
            """
            attribute vec4 aPosition;
            attribute vec2 aTexCoord;
            uniform mat4 uMvpMatrix;
            uniform mat4 uTexMatrix;
            varying vec2 vTexCoord;

            void main() {
                gl_Position = uMvpMatrix * aPosition;
                vTexCoord = (uTexMatrix * vec4(aTexCoord, 0.0, 1.0)).xy;
            }
            """.trimIndent(),
        )

        val fragmentShader = loadShader(
            GLES20.GL_FRAGMENT_SHADER,
            """
            #extension GL_OES_EGL_image_external : require
            precision mediump float;
            varying vec2 vTexCoord;
            uniform samplerExternalOES sTexture;

            void main() {
                gl_FragColor = texture2D(sTexture, vTexCoord);
            }
            """.trimIndent(),
        )

        program = GLES20.glCreateProgram()
        GLES20.glAttachShader(program, vertexShader)
        GLES20.glAttachShader(program, fragmentShader)
        GLES20.glLinkProgram(program)

        positionHandle = GLES20.glGetAttribLocation(program, "aPosition")
        texCoordHandle = GLES20.glGetAttribLocation(program, "aTexCoord")
        mvpMatrixHandle = GLES20.glGetUniformLocation(program, "uMvpMatrix")
        texMatrixHandle = GLES20.glGetUniformLocation(program, "uTexMatrix")
        samplerHandle = GLES20.glGetUniformLocation(program, "sTexture")
    }

    fun draw(textureId: Int, texMatrix: FloatArray, mvpMatrix: FloatArray) {
        GLES20.glUseProgram(program)
        GLES20.glEnableVertexAttribArray(positionHandle)
        GLES20.glEnableVertexAttribArray(texCoordHandle)
        GLES20.glVertexAttribPointer(positionHandle, 2, GLES20.GL_FLOAT, false, 0, vertexBuffer)
        GLES20.glVertexAttribPointer(texCoordHandle, 2, GLES20.GL_FLOAT, false, 0, texBuffer)
        GLES20.glUniformMatrix4fv(mvpMatrixHandle, 1, false, mvpMatrix, 0)
        GLES20.glUniformMatrix4fv(texMatrixHandle, 1, false, texMatrix, 0)
        GLES20.glUniform1i(samplerHandle, 0)
        GLES20.glActiveTexture(GLES20.GL_TEXTURE0)
        GLES20.glBindTexture(GLES11Ext.GL_TEXTURE_EXTERNAL_OES, textureId)
        GLES20.glDrawArrays(GLES20.GL_TRIANGLE_STRIP, 0, 4)
        GLES20.glDisableVertexAttribArray(positionHandle)
        GLES20.glDisableVertexAttribArray(texCoordHandle)
    }

    fun release() {
        if (program != 0) {
            GLES20.glDeleteProgram(program)
            program = 0
        }
    }

    private fun loadShader(type: Int, code: String): Int {
        val shader = GLES20.glCreateShader(type)
        GLES20.glShaderSource(shader, code)
        GLES20.glCompileShader(shader)
        return shader
    }
}
