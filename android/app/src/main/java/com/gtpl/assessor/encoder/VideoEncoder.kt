package com.gtpl.assessor.encoder

import android.media.*
import android.view.Surface
import java.io.File
import java.nio.ByteBuffer

class VideoEncoder(
    val width: Int,
    val height: Int,
    private val path: String
) {
    companion object {
        private const val TIMEOUT_US = 10_000L
    }

    private lateinit var codec: MediaCodec
    private lateinit var muxer: MediaMuxer
    private lateinit var inputSurface: Surface

    private var trackIndex = -1
    private var started = false

    fun start(): Surface {
        val outputFile = File(path)
        outputFile.parentFile?.mkdirs()

        val format = MediaFormat.createVideoFormat("video/avc", width, height)
        format.setInteger(MediaFormat.KEY_COLOR_FORMAT, MediaCodecInfo.CodecCapabilities.COLOR_FormatSurface)
        format.setInteger(MediaFormat.KEY_BIT_RATE, 4000000)
        format.setInteger(MediaFormat.KEY_FRAME_RATE, 30)
        format.setInteger(MediaFormat.KEY_I_FRAME_INTERVAL, 1)

        codec = MediaCodec.createEncoderByType("video/avc")
        codec.configure(format, null, null, MediaCodec.CONFIGURE_FLAG_ENCODE)

        inputSurface = codec.createInputSurface()
        codec.start()

        muxer = MediaMuxer(outputFile.absolutePath, MediaMuxer.OutputFormat.MUXER_OUTPUT_MPEG_4)

        return inputSurface
    }

    fun drain(endOfStream: Boolean) {
        if (endOfStream) {
            codec.signalEndOfInputStream()
        }

        val bufferInfo = MediaCodec.BufferInfo()

        while (true) {
            val outputBufferId = codec.dequeueOutputBuffer(bufferInfo, TIMEOUT_US)

            when {
                outputBufferId == MediaCodec.INFO_TRY_AGAIN_LATER -> {
                    if (!endOfStream) {
                        return
                    }
                }

                outputBufferId == MediaCodec.INFO_OUTPUT_FORMAT_CHANGED -> {
                    if (started) {
                        throw IllegalStateException("Video encoder format changed more than once.")
                    }
                    trackIndex = muxer.addTrack(codec.outputFormat)
                    muxer.start()
                    started = true
                }

                outputBufferId >= 0 -> {
                    val encodedData: ByteBuffer =
                        codec.getOutputBuffer(outputBufferId) ?: continue

                    if (bufferInfo.flags and MediaCodec.BUFFER_FLAG_CODEC_CONFIG != 0) {
                        bufferInfo.size = 0
                    }

                    if (bufferInfo.size > 0 && started) {
                        encodedData.position(bufferInfo.offset)
                        encodedData.limit(bufferInfo.offset + bufferInfo.size)

                        muxer.writeSampleData(trackIndex, encodedData, bufferInfo)
                    }

                    codec.releaseOutputBuffer(outputBufferId, false)

                    if (bufferInfo.flags and MediaCodec.BUFFER_FLAG_END_OF_STREAM != 0) {
                        break
                    }
                }
            }
        }
    }

    fun stop() {
        try {
            codec.stop()
        } finally {
            codec.release()
            inputSurface.release()
            if (started) {
                muxer.stop()
            }
            muxer.release()
        }
    }
}
