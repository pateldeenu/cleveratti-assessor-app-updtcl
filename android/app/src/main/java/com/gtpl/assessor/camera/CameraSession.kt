package com.gtpl.assessor.camera

import android.hardware.camera2.CameraCaptureSession
import android.hardware.camera2.CameraCharacteristics
import android.hardware.camera2.CameraDevice
import android.util.Size
import android.view.Surface

data class CameraStreamConfig(
    val cameraId: String,
    val lensFacing: Int,
    val sensorOrientation: Int,
    val previewSize: Size,
)

data class CameraSession(
    val config: CameraStreamConfig,
    val surface: Surface,
    var device: CameraDevice? = null,
    var captureSession: CameraCaptureSession? = null,
) {
    val isFrontCamera: Boolean
        get() = config.lensFacing == CameraCharacteristics.LENS_FACING_FRONT
}
