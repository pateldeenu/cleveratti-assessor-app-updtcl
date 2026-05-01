package com.gtpl.assessor

import android.content.Context
import android.opengl.GLSurfaceView
import com.facebook.react.bridge.Arguments
import com.facebook.react.bridge.WritableMap
import com.gtpl.assessor.gl.GLRenderer

class DualCameraView(context: Context) : GLSurfaceView(context) {
    private val renderer: GLRenderer
    var eventEmitter: ((String, WritableMap) -> Unit)? = null

    init {
        setEGLContextClientVersion(2)
        preserveEGLContextOnPause = true
        renderer = GLRenderer(context, object : GLRenderer.Callbacks {
            override fun requestRender() {
                this@DualCameraView.requestRender()
            }

            override fun onError(message: String) {
                val payload = Arguments.createMap().apply {
                    putString("message", message)
                }
                eventEmitter?.invoke("onError", payload)
            }

            override fun onRecordingStateChanged(state: String, path: String?) {
                post {
                    renderMode = if (state == "started") {
                        RENDERMODE_CONTINUOUSLY
                    } else {
                        RENDERMODE_WHEN_DIRTY
                    }
                }
                val payload = Arguments.createMap().apply {
                    putString("state", state)
                    if (path != null) {
                        putString("path", path)
                    }
                }
                eventEmitter?.invoke("onRecordingStateChange", payload)
            }
        })
        setRenderer(renderer)
        renderMode = RENDERMODE_WHEN_DIRTY
    }

    fun startRecording(path: String) {
        queueEvent {
            renderer.startRecording(path)
        }
    }

    fun stopRecording() {
        queueEvent {
            renderer.stopRecording()
        }
    }

    override fun onDetachedFromWindow() {
        queueEvent { renderer.release() }
        super.onDetachedFromWindow()
    }
}
