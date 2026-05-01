import { PermissionsAndroid } from "react-native";
import { RTCPeerConnection, RTCSessionDescription, RTCIceCandidate, mediaDevices } from "react-native-webrtc";
import io from "socket.io-client";
import { useEffect } from "react";

const isDebugging = true; // Set to true for logs, false to disable

class WebRTCRecorderClient {

    constructor(roomId, latitude, longitude, currentAddress, dateTime, type, isGroup) {

        console.log("Local roomId 2:", roomId);
        console.log("Local latitudes 2:", latitude);
        console.log("Local longitudess 2:", longitude);
        console.log("Local currentAddress 2:", currentAddress);
        console.log("Local dateTime 2:", dateTime);
        console.log("Local type 2:", type);
        console.log("Local isGroup 2:", isGroup);
        //https://unexploitable-clemmie-nonradically.ngrok-free.dev/cloud-recording

        //https://api.cleverattiskills.com/cloud-recording
        this.roomId = roomId;
        this.latitude = latitude;
        this.longitude = longitude;
        this.currentAddress = currentAddress;
        this.dateTime = new Date().toLocaleString();
        this.type = type;
        this.isGroup = isGroup;
        this.socket = io("https://api.cleverattiskills.com/cloud-recording");
        this.peerConnections = {};
        this.localStream = null;
        this.iceServers = [
            { urls: "stun:stun.l.google.com:19302" },
            { urls: "stun:stun2.l.google.com:19302" },
            {
                urls: "stun:stun.relay.metered.ca:80",
            },
            {
                urls: "turn:standard.relay.metered.ca:80",
                username: "b5c002c77914b73c2fcb71d5",
                credential: "9L6MhO9ySdLIHcog",
            },
            {
                urls: "turn:standard.relay.metered.ca:80?transport=tcp",
                username: "b5c002c77914b73c2fcb71d5",
                credential: "9L6MhO9ySdLIHcog",
            },
            {
                urls: "turn:standard.relay.metered.ca:443",
                username: "b5c002c77914b73c2fcb71d5",
                credential: "9L6MhO9ySdLIHcog",
            },
            {
                urls: "turns:standard.relay.metered.ca:443?transport=tcp",
                username: "b5c002c77914b73c2fcb71d5",
                credential: "9L6MhO9ySdLIHcog",
            },
            {
                urls: "stun:stun.relay.metered.ca:80",
            },
            {
                urls: "turn:in.relay.metered.ca:80",
                username: "95f4e683500afaa2b3ea52e3",
                credential: "eyrkIoypovRn6WxW",
            },
            {
                urls: "turn:in.relay.metered.ca:80?transport=tcp",
                username: "95f4e683500afaa2b3ea52e3",
                credential: "eyrkIoypovRn6WxW",
            },
            {
                urls: "turn:in.relay.metered.ca:443",
                username: "95f4e683500afaa2b3ea52e3",
                credential: "eyrkIoypovRn6WxW",
            },
            {
                urls: "turns:in.relay.metered.ca:443?transport=tcp",
                username: "95f4e683500afaa2b3ea52e3",
                credential: "eyrkIoypovRn6WxW",
            },
            { urls: "turn:turn.cleverattiskills.com:5349?transport=tcp", username: "cleverattiskill", credential: "cleverattiskillsturnserver" },
        ]

        this.log(`🟢 Connecting to room: `, roomId);

        this.socket.on("offer", async ({ from, offer }) => {
            this.log(`📩 Received offer from: ${from}`);
            if (from !== this.socket.id) {
                this.receiveOffer(from, offer);
            }
        });

        this.socket.on("ice-candidate", async ({ from, candidate }) => {
            this.log(`🧊 Received ICE candidate from: ${from}`);
            if (from !== this.socket.id) {
                this.receiveIceCandidate(from, candidate);
            }
        });

        this.socket.on("recording-status", ({ from, reason }) => {
            this.log(`📩 Recording Status offer from: ${from} and reason - ${reason}`);
        });
    }

    log(message, ...args) {
        if (isDebugging) {
            console.log(`[WebRTCRecorderClient] ${message}`, ...args);
        }
    }

    // Check and request microphone permission
    async requestMicrophonePermission() {
        try {
            const granted = await PermissionsAndroid.request(
                PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
                {
                    title: "Microphone Permission",
                    message: "We need access to your microphone to record audio.",
                    buttonNeutral: "Ask Me Later",
                    buttonNegative: "Cancel",
                    buttonPositive: "OK",
                }
            );

            if (granted === PermissionsAndroid.RESULTS.GRANTED) {
                console.log("Microphone permission granted");
                return true;
            } else {
                console.log("Microphone permission denied");
                return false;
            }
        } catch (err) {
            console.warn(err);
            return false;
        }
    }

    async init() {
        // Request permission before accessing the microphone
        const hasPermission = await this.requestMicrophonePermission();
        if (!hasPermission) {
            this.log("❌ Microphone permission denied");
        }
        try {
            this.localStream = await mediaDevices.getUserMedia({
                   video: {
                    width: { min: 640, ideal: 854, max: 1280 },
                    height: { min: 360, ideal: 480, max: 720 },
                    frameRate: { min: 24, ideal: 30 },
                    facingMode: 'environment', // 'user' for front camera, 'environment' for back camera
                },
                audio: true,
            });

            // Set encoding parameters to lock resolution and frameRate
            this.localStream.getVideoTracks().forEach(async (track) => {
                const sender = this.getVideoSender(track);
                if (sender) {
                    const params = sender.getParameters();
                    if (!params.encodings) {
                        params.encodings = [{}];
                    }
                    params.encodings[0].scaleResolutionDownBy = 1.0;
                    params.degradationPreference = "maintain-resolution"; // or "disabled" if supported
                    await sender.setParameters(params);
                }
            });

            this.log("✅ Local media stream acquired");
            this.socket.emit("join-room", this.roomId);
            return this.localStream;
        } catch (error) {
            this.log("❌ Error accessing media devices:", error);
        }
    }

    getVideoSender(track) {
        for (const pc of Object.values(this.peerConnections)) {
            const senders = pc.getSenders();
            const sender = senders.find(s => s.track === track);
            if (sender) return sender;
        }
        return null;
    }

    async receiveOffer(from, offer) {
        this.log(`📩 Processing offer from ${from}...`);
        const peerConnection = new RTCPeerConnection({ iceServers: this.iceServers });
        this.log(`📩 Adding streams in ${from} peer connection stream -> `, this.localStream);
        //peerConnection.addStream(this.localStream)
        this.log(`📩 Added streams in ${from} peer connection stream`);
        this.localStream.getTracks().forEach((track) => peerConnection.addTrack(track, this.localStream));
        this.peerConnections[from] = peerConnection;

        peerConnection.onicecandidate = (event) => {
            if (event.candidate) {
                this.log(`🧊 Sending ICE candidate to ${from}`);
                this.socket.emit("ice-candidate", { to: from, candidate: event.candidate });
            }
        };

        peerConnection.onsignalingstatechange = () => {
            this.log(`🟢 Signaling state changed: ${peerConnection.signalingState}`);
        }

        peerConnection.onconnectionstatechange = (e) => {
            this.log(`🟢 Connection state changed: `, e);
        }
        await peerConnection.setRemoteDescription(new RTCSessionDescription(offer));
        this.log(`✅ Offer set as remote description from ${from}`);

        const answer = await peerConnection.createAnswer();
        await peerConnection.setLocalDescription(answer);
        this.socket.emit("answer", { to: from, answer });
        this.log(`📨 Sent answer to ${from}`);
    }

    async receiveIceCandidate(from, candidate) {
        if (!this.peerConnections[from]) return this.log(`⚠️ No peer connection found for ${from}`);
        this.log(`🧊 Adding ICE candidate from ${from}`);
        await this.peerConnections[from].addIceCandidate(new RTCIceCandidate(candidate));
    }

    retryServerConnection() {
        this.log("🔄 Retrying server connection...");

        if (this.peerConnections["server"]) {
            this.peerConnections["server"].close();
            delete this.peerConnections["server"];
        }
        this.socket.emit("join-room", this.roomId);
    }

    waitForConnection(peerConnection) {
        let attempts = 0;
        const maxAttempts = 5;

        const checkConnection = () => {
            attempts++;
            if (peerConnection.connectionState === "connected") {
                this.log("✅ Peer connection is now active! Starting recording...");
                this.socket.emit("start-recording", { roomId: this.roomId });
                return;
            }

            if (attempts < maxAttempts) {
                this.log(`⏳ Connection still in progress... Retrying (${attempts}/${maxAttempts})`);
                setTimeout(checkConnection, 2000); // Retry every 2 seconds
            } else {
                this.log("❌ Connection did not establish in time. Retrying from scratch...");
                this.retryServerConnection();
            }
        };

        checkConnection();
    }


    handleStartRecording(orientation) {
        this.log("🎥 Attempting to start recording...", this.peerConnections);
        const serverConnection = this.peerConnections["server"];
        if (!serverConnection) {
            this.log("⚠️ No active connection found. Retrying connection...");
            this.retryServerConnection();
            return false;
        }
        const { connectionState, localDescription, remoteDescription } = serverConnection;

        console.log("📡 Connection State:", connectionState);
        console.log("📝 Local Description:", localDescription ? "✅ Set" : "❌ Not Set");
        console.log("📝 Remote Description:", remoteDescription ? "✅ Set" : "❌ Not Set");


        if (connectionState === "connected") {
            // this.socket.emit("start-recording", { roomId: this.roomId });
            this.socket.emit("start-recording", {
                roomId: this.roomId, geolocation: {
                    latitude: this.latitude, longitude: this.longitude, address: this.currentAddress, time: this.dateTime
                }, type: this.type, isGroup: this.isGroup,
                orientation: orientation
            });
            return true;
        }

        if (connectionState === "connecting") {
            this.log("⏳ Connection still in progress. Waiting...");
            this.waitForConnection(serverConnection);
            return false;
        }

        if (connectionState === "disconnected" || connectionState === "failed") {
            this.log("⚠️ Connection lost. Retrying...");
            this.retryServerConnection();
            return false;
        }

        this.log("❌ Unexpected connection state:", connectionState);
        return false;
    }

    // handleDisconnect() {
    //     this.log("🔴 Disconnected from the server");
    //     this.socket.disconnect();
    //     Object.values(this.peerConnections).forEach(pc => pc.close());
    //     this.peerConnections = {};
    //     this.localStream.getTracks().forEach((track) => track.stop());
    //     this.localStream = null;
    // }

     handleDisconnect() {
        this.log("🔴 Disconnected from the server");
        this.socket.disconnect();
        Object.values(this.peerConnections).forEach((pc) => pc.close());
        this.peerConnections = {};

        if (this.localStream) {   // 👈 check before stopping
            this.localStream.getTracks().forEach((track) => track.stop());
            this.localStream = null;
        }
    }
}

export default WebRTCRecorderClient;
