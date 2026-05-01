import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  KeyboardAvoidingView,
  PermissionsAndroid,
  Platform,
  ScrollView,
  View,
  TouchableOpacity,
  Image,
  Text,
} from "react-native";
import {
  ChannelProfileType,
  ClientRoleType,
  createAgoraRtcEngine,
  RtcSurfaceView,
  RtcTextureView,
  VideoViewSetupMode,
} from "react-native-agora";
import { CustomeButton } from "../../components";
import DynamicImage from "../../constants/DynamicImage";
import { ConfigColor } from "../AssessmentDetails/Utils";
import Config from "../LiveStreaming/AgoraVideoCall/components/config";


import {
  AgoraStyle,
  AgoraView,
} from "./ui";

export default function CandidateVivaLiveStreaming(tokens, channelIds, candiadteViva= false) {


  const [appId] = useState(Config.appId);
  const [enableVideo] = useState(true);
  const [channelId, setChannelId] = useState(channelIds);
  const [token, setToken] = useState(tokens);
  const [uid] = useState(Config.uid);
  const [joinChannelSuccess, setJoinChannelSuccess] = useState(false);
  const [remoteUsers, setRemoteUsers] = useState([]);
  const [startPreview, setStartPreview] = useState(false);
  const [switchCamera, setSwitchCamera] = useState(false);
  const [renderByTextureView, setRenderByTextureView] = useState(false);
  const [setupMode, setSetupMode] = useState(
    VideoViewSetupMode.VideoViewSetupReplace
  );


  // consoleLog('tookeb', token)

  useEffect(()=> {

    setTimeout(()=>{

      joinChannelSuccess ? leaveChannel() : joinChannel();
    },3000)
  },[])



  const engine = useRef(createAgoraRtcEngine());

  /**
   * Step 1: initRtcEngine
   */
  const initRtcEngine = useCallback(async () => {
    if (!appId) {
      console.error(`appId is invalid`);
    }

    engine.current.initialize({
      appId,
      // Should use ChannelProfileLiveBroadcasting on most of cases
      channelProfile: ChannelProfileType.ChannelProfileLiveBroadcasting,
    });

    if (Platform.OS === "android") {
      // Need granted the microphone and camera permission
      await PermissionsAndroid.requestMultiple([
        "android.permission.RECORD_AUDIO",
        "android.permission.CAMERA",
      ]);
    }

    // Need to enable video on this case
    // If you only call `enableAudio`, only relay the audio stream to the target channel
    engine.current.enableVideo();

    // Start preview before joinChannel
    engine.current.startPreview();
    setStartPreview(true);
  }, [appId]);

  /**
   * Step 2: joinChannel
   */
  const joinChannel = () => {
    if (!channelId) {
      console.error("channelId is invalid");
      return;
    }
    if (uid < 0) {
      console.error("uid is invalid");
      return;
    }

    // start joining channel
    // 1. Users can only see each other after they join the
    // same channel successfully using the same app id.
    // 2. If app certificate is turned on at dashboard, token is needed
    // when joining channel. The channel name and uid used to calculate
    // the token has to match the ones used for channel join
    engine.current.joinChannel(token, channelId, uid, {
      // Make myself as the broadcaster to send stream to remote
      clientRoleType: ClientRoleType.ClientRoleBroadcaster,
    });
  };

  /**
   * Step 3 (Optional): switchCamera
   */
  const updateSwitchCamera = () => {
    engine.current.switchCamera();
    setSwitchCamera(!switchCamera);
  };

  /**
   * Step 4: leaveChannel
   */
  const leaveChannel = () => {
    engine.current.leaveChannel();
  };

  useEffect(() => {
    initRtcEngine().then(() => {
      engine.current.addListener("onError", (err, msg) => {
        console.info("onError", "err", err, "msg", msg);
      });

      engine.current.addListener(
        "onJoinChannelSuccess",
        (connection, elapsed) => {
          console.info(
            "onJoinChannelSuccess",
            "connection",
            connection,
            "elapsed",
            elapsed
          );
          setJoinChannelSuccess(true);
        }
      );

      engine.current.addListener("onLeaveChannel", (connection, stats) => {
        console.info(
          "onLeaveChannel",
          "connection",
          connection,
          "stats",
          stats
        );
        setJoinChannelSuccess(false);
        setRemoteUsers([]);
      });

      engine.current.addListener(
        "onUserJoined",
        (connection, remoteUid, elapsed) => {
          console.info(
            "onUserJoined",
            "connection",
            connection,
            "remoteUid",
            remoteUid,
            "elapsed",
            elapsed
          );
          setRemoteUsers((r) => {
            if (r === undefined) return [];
            return [...r, remoteUid];
          });
        }
      );

      engine.current.addListener(
        "onUserOffline",
        (connection, remoteUid, reason) => {
          console.info(
            "onUserOffline",
            "connection",
            connection,
            "remoteUid",
            remoteUid,
            "reason",
            reason
          );
          setRemoteUsers((r) => {
            if (r === undefined) return [];
            return r.filter((value) => value !== remoteUid);
          });
        }
      );

      engine.current.addListener(
        "onVideoDeviceStateChanged",
        (deviceId, deviceType, deviceState) => {
          console.info(
            "onVideoDeviceStateChanged",
            "deviceId",
            deviceId,
            "deviceType",
            deviceType,
            "deviceState",
            deviceState
          );
        }
      );

      engine.current.addListener(
        "onLocalVideoStateChanged",
        (source, state, error) => {
          console.info(
            "onLocalVideoStateChanged",
            "source",
            source,
            "state",
            state,
            "error",
            error
          );
        }
      );
    });

    const engineCopy = engine.current;
    return () => {
      engineCopy.release();
    };
  }, [initRtcEngine]);

  const configuration = renderConfiguration();
  return (
    <KeyboardAvoidingView
      style={AgoraStyle.fullSize}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      {/* <AgoraView style={AgoraStyle.fullWidth}>{renderChannel()}</AgoraView> */}
      {enableVideo ? (
        <AgoraView style={AgoraStyle.videoLarge}>{renderUsers()}</AgoraView>
      ) : undefined}
      {configuration ? (
        <>
          <View style={AgoraStyle.fullSize}>{configuration}</View>
        </>
      ) : undefined}
    </KeyboardAvoidingView>
  );

 

  function renderUsers() {
    return (
      <>
        {startPreview || joinChannelSuccess ? renderVideo(0) : undefined}
        {remoteUsers !== undefined && remoteUsers.length > 0 ? (
          <View  style={AgoraStyle.videoContainer}>
            {remoteUsers.map((value, index) => (
              <AgoraView key={`${value}-${index}`}>
                {renderVideo(value)}
              </AgoraView>
            ))}
          </View>
        ) : undefined}
      </>
    );
  }

  function renderVideo(uid) {
// if(candiadteViva){
//   return renderByTextureView ? (
//     <RtcTextureView
//       style={uid === 0 ?[ AgoraStyle.videoLargeCand] : AgoraStyle.videoSmallCand}
//       canvas={{ uid, setupMode }}
//     />
//   ) : (
//     <RtcSurfaceView
//       style={uid === 0 ? AgoraStyle.videoLargeCand : AgoraStyle.videoSmallCand}
//       zOrderMediaOverlay={uid !== 0}
//       canvas={{ uid, setupMode }}
//     />
//   );

// }else{

 return renderByTextureView ? (
      <RtcTextureView
        style={uid === 0 ?[ AgoraStyle.videoLarge] : AgoraStyle.videoSmall}
        canvas={{ uid, setupMode }}
      />
    ) : (
      <RtcSurfaceView
        style={uid === 0 ? AgoraStyle.videoLarge : AgoraStyle.videoSmall}
        zOrderMediaOverlay={uid !== 0}
        canvas={{ uid, setupMode }}
      />
    );
// }


   
  }

  function renderConfiguration() {
    return (
      <>
       

<View style={{flexDirection:'row-reverse',alignSelf:'flex-end'}}>

        <AgoraView style={AgoraStyle.float}>{renderAction()}</AgoraView>

     { !candiadteViva ? <CustomeButton
          textColor={ConfigColor.white}
          label={`${joinChannelSuccess ? "leave" : "Start"} `}
          labelStyle={{ fontSize: 14 }}
          onPress={() => {
            joinChannelSuccess ? leaveChannel() : joinChannel();
          }}
          buttonContainerStyle={[AgoraStyle.container]}
        />:null}
       </View>

       
      </>
    );
  }

  function renderAction() {
    return (
      <>
       
        <TouchableOpacity onPress={updateSwitchCamera}>
          <Image
            resizeMode="cover"
            style={AgoraStyle.imageH}
            source={DynamicImage.cameraIcon}
          />
        </TouchableOpacity>
      </>
    );
  }
}
