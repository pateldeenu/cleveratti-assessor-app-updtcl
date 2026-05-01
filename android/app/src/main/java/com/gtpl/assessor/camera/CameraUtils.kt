package com.gtpl.assessor.camera

import android.graphics.SurfaceTexture
import android.hardware.camera2.CameraCharacteristics
import android.hardware.camera2.CameraManager
import android.hardware.camera2.params.StreamConfigurationMap
import android.os.Build
import android.util.Size
import kotlin.math.abs

object CameraUtils {
    private val preferredPreviewSize = Size(1280, 720)

    fun resolveCamera(manager: CameraManager, lensFacing: Int): CameraStreamConfig? {
        return manager.cameraIdList
            .asSequence()
            .mapNotNull { cameraId ->
                val characteristics = manager.getCameraCharacteristics(cameraId)
                val currentLensFacing = characteristics.get(CameraCharacteristics.LENS_FACING) ?: return@mapNotNull null
                if (currentLensFacing != lensFacing) {
                    return@mapNotNull null
                }
                val streamMap = characteristics.get(CameraCharacteristics.SCALER_STREAM_CONFIGURATION_MAP) ?: return@mapNotNull null
                val previewSize = choosePreviewSize(streamMap) ?: return@mapNotNull null
                CameraStreamConfig(
                    cameraId = cameraId,
                    lensFacing = currentLensFacing,
                    sensorOrientation = characteristics.get(CameraCharacteristics.SENSOR_ORIENTATION) ?: 0,
                    previewSize = previewSize,
                )
            }
            .firstOrNull()
    }

    fun resolveConcurrentBackFrontPair(manager: CameraManager): Pair<CameraStreamConfig, CameraStreamConfig>? {
        if (Build.VERSION.SDK_INT < Build.VERSION_CODES.R) {
            return null
        }

        return manager.concurrentCameraIds
            .asSequence()
            .mapNotNull { ids -> buildPair(manager, ids) }
            .firstOrNull()
    }

    private fun buildPair(
        manager: CameraManager,
        cameraIds: Set<String>,
    ): Pair<CameraStreamConfig, CameraStreamConfig>? {
        var back: CameraStreamConfig? = null
        var front: CameraStreamConfig? = null

        cameraIds.forEach { cameraId ->
            val characteristics = manager.getCameraCharacteristics(cameraId)
            val lensFacing = characteristics.get(CameraCharacteristics.LENS_FACING) ?: return@forEach
            val streamMap = characteristics.get(CameraCharacteristics.SCALER_STREAM_CONFIGURATION_MAP) ?: return@forEach
            val previewSize = choosePreviewSize(streamMap) ?: return@forEach
            val config = CameraStreamConfig(
                cameraId = cameraId,
                lensFacing = lensFacing,
                sensorOrientation = characteristics.get(CameraCharacteristics.SENSOR_ORIENTATION) ?: 0,
                previewSize = previewSize,
            )

            when (lensFacing) {
                CameraCharacteristics.LENS_FACING_BACK -> back = config
                CameraCharacteristics.LENS_FACING_FRONT -> front = config
            }
        }

        val backConfig = back ?: return null
        val frontConfig = front ?: return null
        return backConfig to frontConfig
    }

    private fun choosePreviewSize(streamMap: StreamConfigurationMap): Size? {
        val outputSizes = streamMap.getOutputSizes(SurfaceTexture::class.java) ?: return null
        return outputSizes
            .filter { size -> size.width <= 1920 && size.height <= 1080 }
            .minByOrNull { size ->
                val aspectPenalty = abs((size.width.toFloat() / size.height) - (16f / 9f))
                val widthPenalty = abs(size.width - preferredPreviewSize.width)
                aspectPenalty * 10_000f + widthPenalty
            }
            ?: outputSizes.maxByOrNull { it.width * it.height }
    }
}
