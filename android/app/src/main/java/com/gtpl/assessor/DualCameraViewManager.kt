package com.gtpl.assessor

import com.facebook.react.bridge.ReadableArray
import com.facebook.react.uimanager.SimpleViewManager
import com.facebook.react.uimanager.ThemedReactContext
import com.facebook.react.uimanager.events.RCTEventEmitter

class DualCameraViewManager : SimpleViewManager<DualCameraView>() {

    override fun getName() = "DualCameraView"

    override fun createViewInstance(context: ThemedReactContext): DualCameraView {
        return DualCameraView(context).apply {
            eventEmitter = { eventName, payload ->
                context.getJSModule(RCTEventEmitter::class.java).receiveEvent(id, eventName, payload)
            }
        }
    }

    override fun getCommandsMap() = mapOf("startRecording" to 1, "stopRecording" to 2)

    override fun receiveCommand(view: DualCameraView, commandId: Int, args: ReadableArray?) {
        handleCommand(view, commandId.toString(), args)
    }

    override fun receiveCommand(view: DualCameraView, commandId: String, args: ReadableArray?) {
        handleCommand(view, commandId, args)
    }

    override fun getExportedCustomDirectEventTypeConstants(): MutableMap<String, Any> {
        return mutableMapOf(
            "onError" to mapOf("registrationName" to "onError"),
            "onRecordingStateChange" to mapOf("registrationName" to "onRecordingStateChange"),
        )
    }

    private fun handleCommand(view: DualCameraView, commandId: String, args: ReadableArray?) {
        when (commandId) {
            "1", "startRecording" -> view.startRecording(args?.getString(0) ?: "")
            "2", "stopRecording" -> view.stopRecording()
        }
    }
}
