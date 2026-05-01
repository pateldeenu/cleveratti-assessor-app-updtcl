package com.gtpl.assessor.encoder


import android.opengl.*
import android.view.Surface

class EglRecorder(private val surface: Surface) {

    private var display: EGLDisplay? = null
    private var context: EGLContext? = null
    private var eglSurface: EGLSurface? = null
    private var ownsContext = false

    fun init(sharedContext: EGLContext) {
        display = EGL14.eglGetDisplay(EGL14.EGL_DEFAULT_DISPLAY)
        EGL14.eglInitialize(display, null, 0, null, 0)

        val configs = arrayOfNulls<EGLConfig>(1)
        EGL14.eglChooseConfig(
            display,
            intArrayOf(
                EGL14.EGL_RENDERABLE_TYPE, EGL14.EGL_OPENGL_ES2_BIT,
                EGL14.EGL_RED_SIZE, 8,
                EGL14.EGL_GREEN_SIZE, 8,
                EGL14.EGL_BLUE_SIZE, 8,
                EGL14.EGL_ALPHA_SIZE, 8,
                EGLExt.EGL_RECORDABLE_ANDROID, 1,
                EGL14.EGL_NONE
            ),
            0,
            configs,
            0,
            1,
            IntArray(1),
            0
        )

        context = sharedContext
        ownsContext = false

        eglSurface = EGL14.eglCreateWindowSurface(
            display,
            configs[0],
            surface,
            intArrayOf(EGL14.EGL_NONE),
            0
        )
    }

    fun makeCurrent() {
        EGL14.eglMakeCurrent(display, eglSurface, eglSurface, context)
    }

    fun swapBuffers() {
        EGL14.eglSwapBuffers(display, eglSurface)
    }

    fun setTime(nanoTime: Long) {
        EGLExt.eglPresentationTimeANDROID(display, eglSurface, nanoTime)
    }

    fun release() {
        EGL14.eglMakeCurrent(display, EGL14.EGL_NO_SURFACE, EGL14.EGL_NO_SURFACE, EGL14.EGL_NO_CONTEXT)
        EGL14.eglDestroySurface(display, eglSurface)
        if (ownsContext) {
            EGL14.eglDestroyContext(display, context)
        }
        surface.release()
    }
}
