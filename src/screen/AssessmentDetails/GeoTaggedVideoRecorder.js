// GeoTaggedVideoRecorder.js
// Records video with Geotagging and saves to app's internal storage folder
// Saves: /Internal Storage/GeoTagVideos/YYYY-MM-DD/GeoVid_timestamp.mp4
//        /Internal Storage/GeoTagVideos/YYYY-MM-DD/GeoVid_timestamp_geotag.json

import React, { useEffect, useRef, useState, useCallback } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Platform,
  ScrollView,
  ActivityIndicator,
  StatusBar,
  Animated,
  PermissionsAndroid,
} from 'react-native';
import {
  Camera,
  useCameraDevice,
  useCameraPermission,
  useMicrophonePermission,
} from 'react-native-vision-camera';
import Geolocation from 'react-native-geolocation-service';
import { check, request, PERMISSIONS, RESULTS } from 'react-native-permissions';
import RNFS from 'react-native-fs';

// ─────────────────────────────────────────────────────────────────────────────
// STORAGE CONFIG
// Android : /storage/emulated/0/GeoTagVideos/YYYY-MM-DD/
// iOS     : <DocumentDirectory>/GeoTagVideos/YYYY-MM-DD/
// ─────────────────────────────────────────────────────────────────────────────

const BASE_FOLDER =
  Platform.OS === 'android'
    ? `${RNFS.ExternalStorageDirectoryPath}/GeoTagVideos`
    : `${RNFS.DocumentDirectoryPath}/GeoTagVideos`;

// Ensure a directory exists, create it if not
async function ensureDir(path) {
  const exists = await RNFS.exists(path);
  if (!exists) await RNFS.mkdir(path);
}

// Today's date folder: e.g. .../GeoTagVideos/2024-05-02
function todayFolder() {
  const d  = new Date();
  const yy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  const dd = String(d.getDate()).padStart(2, '0');
  return `${BASE_FOLDER}/${yy}-${mm}-${dd}`;
}

// Unique filename based on current time
function makeFileName() {
  const ts = new Date().toISOString().replace(/[:.]/g, '-').replace('T', '_').slice(0, 19);
  return `GeoVid_${ts}`;
}

// ─── Reverse Geocoding via OpenStreetMap (FREE — no API key needed) ───────────
async function reverseGeocode(lat, lon) {
  try {
    const res = await fetch(
      `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}&zoom=18&addressdetails=1`,
      { headers: { 'User-Agent': 'GeoTagVideoApp/1.0', 'Accept-Language': 'en' } }
    );
    const data = await res.json();
    if (data?.display_name) {
      return data.display_name.split(',').slice(0, 4).join(',').trim();
    }
    return `${lat.toFixed(6)}, ${lon.toFixed(6)}`;
  } catch {
    return `${lat.toFixed(6)}, ${lon.toFixed(6)}`;
  }
}

// ─── Android storage permission (only needed on Android < 10) ────────────────
async function requestStoragePerm() {
  if (Platform.OS !== 'android' || Platform.Version >= 29) return true;
  const granted = await PermissionsAndroid.request(
    PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
    {
      title: 'Storage Permission',
      message: 'Needed to save geotagged videos to internal storage.',
      buttonPositive: 'Allow',
    }
  );
  return granted === PermissionsAndroid.RESULTS.GRANTED;
}

// ─────────────────────────────────────────────────────────────────────────────
// MAIN COMPONENT
// ─────────────────────────────────────────────────────────────────────────────
export default function GeoTaggedVideoRecorder() {
  const device  = useCameraDevice('back');
  const { hasPermission: hasCamPerm, requestPermission: reqCamPerm } = useCameraPermission();
  const { hasPermission: hasMicPerm, requestPermission: reqMicPerm } = useMicrophonePermission();
  const camera  = useRef(null);

  const [isRecording,       setIsRecording]       = useState(false);
  const [duration,          setDuration]           = useState(0);
  const [geoTag,            setGeoTag]             = useState(null);
  const [loadingGeo,        setLoadingGeo]         = useState(false);
  const [savedVideos,       setSavedVideos]        = useState([]);
  const [locGranted,        setLocGranted]         = useState(false);
  const [isCameraReady,     setIsCameraReady]      = useState(false);

  const timerRef    = useRef(null);
  const geoAtStart  = useRef(null);
  const pulseAnim   = useRef(new Animated.Value(1)).current;

  // ── Blinking REC dot ─────────────────────────────────────────────────────
  useEffect(() => {
    if (isRecording) {
      Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, { toValue: 0.15, duration: 500, useNativeDriver: true }),
          Animated.timing(pulseAnim, { toValue: 1,    duration: 500, useNativeDriver: true }),
        ])
      ).start();
    } else {
      pulseAnim.stopAnimation();
      pulseAnim.setValue(1);
    }
  }, [isRecording]);

  // ── Request every permission + create base folder ─────────────────────────
  const setupPermissions = useCallback(async () => {
    if (!hasCamPerm) await reqCamPerm();
    if (!hasMicPerm) await reqMicPerm();

    const locPerm =
      Platform.OS === 'ios'
        ? PERMISSIONS.IOS.LOCATION_WHEN_IN_USE
        : PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION;

    let res = await check(locPerm);
    if (res !== RESULTS.GRANTED) res = await request(locPerm);
    const granted = res === RESULTS.GRANTED;
    setLocGranted(granted);

    await requestStoragePerm();

    // Pre-create GeoTagVideos root folder
    try { await ensureDir(BASE_FOLDER); } catch (e) { console.warn(e.message); }

    if (!granted) {
      Alert.alert('Location Required', 'Please enable location permission for geotagging.');
    }
  }, [hasCamPerm, hasMicPerm, reqCamPerm, reqMicPerm]);

  useEffect(() => { setupPermissions(); }, []);

  // ── Get GPS + address ─────────────────────────────────────────────────────
  const fetchGeo = useCallback(() => new Promise((resolve, reject) => {
    setLoadingGeo(true);

    const buildTag = async (coords) => {
      const { latitude, longitude, accuracy } = coords;
      const now  = new Date();
      const addr = await reverseGeocode(latitude, longitude);
      return {
        latitude, longitude, accuracy, address: addr,
        timestamp: now.toISOString(),
        formattedTime: now.toLocaleString('en-IN', {
          day: '2-digit', month: 'short', year: 'numeric',
          hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true,
        }),
      };
    };

    // Try high accuracy first; fall back to network/coarse on failure
    Geolocation.getCurrentPosition(
      async ({ coords }) => {
        const tag = await buildTag(coords);
        setGeoTag(tag);
        setLoadingGeo(false);
        resolve(tag);
      },
      () => {
        // High-accuracy failed — retry with network/coarse location
        Geolocation.getCurrentPosition(
          async ({ coords }) => {
            const tag = await buildTag(coords);
            setGeoTag(tag);
            setLoadingGeo(false);
            resolve(tag);
          },
          (err) => { setLoadingGeo(false); reject(err); },
          { enableHighAccuracy: false, timeout: 20000, maximumAge: 30000 }
        );
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 5000 }
    );
  }), []);

  useEffect(() => { if (locGranted) fetchGeo().catch(() => {}); }, [locGranted]);

  // ── mm:ss formatter ──────────────────────────────────────────────────────
  const fmt = (s) =>
    `${Math.floor(s / 60).toString().padStart(2, '0')}:${(s % 60).toString().padStart(2, '0')}`;

  // ── START recording ───────────────────────────────────────────────────────
  const startRecording = useCallback(async () => {
    if (!camera.current || !isCameraReady) {
      Alert.alert('Camera Not Ready', 'Please wait for the camera to finish initializing.');
      return;
    }
    try {
      // Lock geo at the moment recording starts
      const tag = geoTag ?? await fetchGeo();
      geoAtStart.current = tag;  // snapshot geo at the moment recording starts

      // Create today's folder
      const folder = todayFolder();
      await ensureDir(BASE_FOLDER);
      await ensureDir(folder);

      // Kick off timer
      setDuration(0);
      timerRef.current = setInterval(() => setDuration((p) => p + 1), 1000);
      setIsRecording(true);

      camera.current.startRecording({
        fileType:     'mp4',
        videoBitRate: 'high',

        onRecordingFinished: async (video) => {
          clearInterval(timerRef.current);
          setIsRecording(false);
          setDuration(0);

          const geo      = geoAtStart.current;
          const base     = makeFileName();
          const destMp4  = `${todayFolder()}/${base}.mp4`;
          const destJson = `${todayFolder()}/${base}_geotag.json`;

          try {
            // Move from camera temp → our internal folder
            await ensureDir(todayFolder());
            await RNFS.moveFile(video.path, destMp4);

            // Save geotag metadata JSON
            await RNFS.writeFile(
              destJson,
              JSON.stringify({
                videoFile:  destMp4,
                duration:   video.duration,
                savedAt:    new Date().toISOString(),
                geoTag:     geo,
                deviceInfo: { platform: Platform.OS, version: String(Platform.Version) },
              }, null, 2),
              'utf8'
            );

            setSavedVideos((prev) => [
              { path: destMp4, jsonPath: destJson, duration: video.duration, geo },
              ...prev,
            ]);

            Alert.alert(
              '✅ Video Saved!',
              `📁 ${destMp4}\n\n📍 ${geo.address}\n🌐 ${geo.latitude.toFixed(6)}, ${geo.longitude.toFixed(6)}\n🕐 ${geo.formattedTime}`,
              [{ text: 'Great!' }]
            );
          } catch (err) {
            Alert.alert('Save Error', err.message);
          }
        },

        onRecordingError: (err) => {
          clearInterval(timerRef.current);
          setIsRecording(false);
          setDuration(0);
          Alert.alert('Recording Error', err.message);
        },
      });
    } catch (err) {
      Alert.alert('Location Error', err.message);
    }
  }, [fetchGeo, geoTag, isCameraReady]);

  // ── STOP recording ────────────────────────────────────────────────────────
  const stopRecording = useCallback(async () => {
    if (!camera.current || !isRecording) return;
    await camera.current.stopRecording();
  }, [isRecording]);

  // ─────────────────────────────────────────────────────────────────────────
  // SCREENS
  // ─────────────────────────────────────────────────────────────────────────

  if (!hasCamPerm || !hasMicPerm) {
    return (
      <View style={S.center}>
        <Text style={S.bigIcon}>🎥</Text>
        <Text style={S.title}>Permissions Needed</Text>
        <Text style={S.subtitle}>Camera, Microphone & Location are required.</Text>
        <TouchableOpacity style={S.grantBtn} onPress={setupPermissions}>
          <Text style={S.grantBtnTxt}>Grant Permissions</Text>
        </TouchableOpacity>
      </View>
    );
  }

  if (!device) {
    return (
      <View style={S.center}>
        <ActivityIndicator size="large" color="#FF3B30" />
        <Text style={S.subtitle}>Loading camera…</Text>
      </View>
    );
  }

  return (
    <View style={S.root}>
      <StatusBar barStyle="light-content" backgroundColor="#000" />

      {/* Camera full screen */}
      <Camera
        ref={camera}
        style={StyleSheet.absoluteFill}
        device={device}
        isActive={true}
        video={true}
        audio={true}
        enableZoomGesture={true}
        onInitialized={() => setIsCameraReady(true)}
      />

      {/* ── TOP: save path ── */}
      <View style={S.topBanner}>
        <Text style={S.topBannerTxt} numberOfLines={1}>
          💾  {BASE_FOLDER}
        </Text>
      </View>

      {/* ── REC badge ── */}
      {isRecording && (
        <View style={S.recRow}>
          <Animated.View style={[S.recDot, { opacity: pulseAnim }]} />
          <Text style={S.recTime}>{fmt(duration)}</Text>
        </View>
      )}

      {/* ── GeoTag info panel ── */}
      <View style={S.geoPanel}>
        {loadingGeo ? (
          <View style={S.row}>
            <ActivityIndicator size="small" color="#FFD60A" />
            <Text style={S.geoWhite}>  Fetching location…</Text>
          </View>
        ) : geoTag ? (
          <>
            <View style={S.row}>
              <Text style={S.ico}>📍</Text>
              <Text style={S.geoWhite} numberOfLines={2}>{geoTag.address}</Text>
            </View>
            <View style={S.row}>
              <Text style={S.ico}>🌐</Text>
              <Text style={S.geoYellow}>
                {geoTag.latitude.toFixed(6)},  {geoTag.longitude.toFixed(6)}
              </Text>
              <Text style={S.geoGray}>  ±{geoTag.accuracy.toFixed(0)} m</Text>
            </View>
            <View style={S.row}>
              <Text style={S.ico}>🕐</Text>
              <Text style={S.geoBlue}>{geoTag.formattedTime}</Text>
            </View>
          </>
        ) : (
          <View style={S.row}>
            <Text style={S.geoWhite}>Location unavailable  </Text>
            <TouchableOpacity style={S.retryBtn} onPress={fetchGeo}>
              <Text style={S.retryTxt}>Retry</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>

      {/* ── Controls ── */}
      <View style={S.controls}>
        {/* Refresh GPS */}
        <TouchableOpacity style={S.iconBtn} onPress={fetchGeo} disabled={isRecording}>
          <Text style={S.iconBtnIco}>🔄</Text>
          <Text style={S.iconBtnLbl}>GPS</Text>
        </TouchableOpacity>

        {/* Record / Stop */}
        <TouchableOpacity
          style={[S.recBtn, isRecording && S.recBtnActive, !isCameraReady && S.recBtnDisabled]}
          onPress={isRecording ? stopRecording : startRecording}
          disabled={!isCameraReady}
          activeOpacity={0.8}
        >
          {!isCameraReady
            ? <ActivityIndicator size="small" color="#fff" />
            : isRecording
              ? <View style={S.stopIcon} />
              : <View style={S.playIcon} />}
        </TouchableOpacity>

        {/* Count */}
        <View style={S.iconBtn}>
          <Text style={S.countTxt}>{savedVideos.length}</Text>
          <Text style={S.iconBtnLbl}>Saved</Text>
        </View>
      </View>

      {/* ── Saved videos carousel ── */}
      {savedVideos.length > 0 && (
        <View style={S.carousel}>
          <Text style={S.carouselHdr}>📂  Saved to Internal Storage</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {savedVideos.map((v, i) => (
              <View key={i} style={S.card}>
                <Text style={S.cardTitle}>🎥  Video #{savedVideos.length - i}</Text>
                <Text style={S.cardDate}>{v.geo.formattedTime}</Text>
                <Text style={S.cardAddr} numberOfLines={2}>📍 {v.geo.address}</Text>
                <Text style={S.cardCoord}>
                  {v.geo.latitude.toFixed(5)}, {v.geo.longitude.toFixed(5)}
                </Text>
                <Text style={S.cardDur}>⏱  {v.duration ? v.duration.toFixed(1) : '—'} s</Text>
                <Text style={S.cardFile} numberOfLines={2}>
                  💾 …/{v.path.split('/').slice(-2).join('/')}
                </Text>
              </View>
            ))}
          </ScrollView>
        </View>
      )}
    </View>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// STYLES
// ─────────────────────────────────────────────────────────────────────────────
const S = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#000' },

  // centre screens
  center:      { flex: 1, backgroundColor: '#0a0a0a', alignItems: 'center', justifyContent: 'center', padding: 32 },
  bigIcon:     { fontSize: 60, marginBottom: 14 },
  title:       { fontSize: 22, fontWeight: '700', color: '#fff', marginBottom: 10 },
  subtitle:    { fontSize: 14, color: '#888', textAlign: 'center', lineHeight: 22, marginBottom: 24 },
  grantBtn:    { backgroundColor: '#FF3B30', paddingHorizontal: 30, paddingVertical: 13, borderRadius: 50 },
  grantBtnTxt: { color: '#fff', fontSize: 15, fontWeight: '700' },

  // save-path banner
  topBanner: {
    position: 'absolute',
    top: Platform.OS === 'ios' ? 52 : 14,
    left: 12, right: 12,
    backgroundColor: 'rgba(0,0,0,0.62)',
    borderRadius: 8,
    paddingHorizontal: 12, paddingVertical: 6,
    zIndex: 30,
    borderWidth: 1, borderColor: 'rgba(90,200,250,0.22)',
  },
  topBannerTxt: { color: '#5AC8FA', fontSize: 11 },

  // REC
  recRow: {
    position: 'absolute',
    top: Platform.OS === 'ios' ? 100 : 58,
    alignSelf: 'center',
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.62)',
    paddingHorizontal: 18, paddingVertical: 7,
    borderRadius: 22, zIndex: 30,
  },
  recDot:  { width: 11, height: 11, borderRadius: 6, backgroundColor: '#FF3B30', marginRight: 8 },
  recTime: { color: '#fff', fontSize: 20, fontWeight: '700' },

  // geotag panel
  geoPanel: {
    position: 'absolute',
    bottom: 188,
    left: 12, right: 12,
    backgroundColor: 'rgba(0,0,0,0.7)',
    borderRadius: 14,
    padding: 14,
    zIndex: 30,
    borderWidth: 1, borderColor: 'rgba(255,214,10,0.28)',
  },
  row:       { flexDirection: 'row', alignItems: 'center', marginBottom: 5 },
  ico:       { fontSize: 13, marginRight: 6 },
  geoWhite:  { color: '#fff',    fontSize: 12, flex: 1, lineHeight: 17 },
  geoYellow: { color: '#FFD60A', fontSize: 12, fontWeight: '600' },
  geoGray:   { color: '#999',    fontSize: 11 },
  geoBlue:   { color: '#5AC8FA', fontSize: 12 },
  retryBtn:  { backgroundColor: '#FF3B30', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 8 },
  retryTxt:  { color: '#fff', fontSize: 11, fontWeight: '600' },

  // bottom controls
  controls: {
    position: 'absolute',
    bottom: 42,
    left: 0, right: 0,
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    zIndex: 30, gap: 36,
  },
  recBtn:         { width: 82, height: 82, borderRadius: 41, backgroundColor: 'rgba(255,255,255,0.12)', borderWidth: 4, borderColor: '#fff', alignItems: 'center', justifyContent: 'center' },
  recBtnActive:   { borderColor: '#FF3B30', backgroundColor: 'rgba(255,59,48,0.18)' },
  recBtnDisabled: { borderColor: '#555', backgroundColor: 'rgba(255,255,255,0.05)', opacity: 0.5 },
  playIcon:     { width: 38, height: 38, borderRadius: 19, backgroundColor: '#FF3B30' },
  stopIcon:     { width: 28, height: 28, borderRadius: 5,  backgroundColor: '#FF3B30' },
  iconBtn:      { alignItems: 'center', width: 56 },
  iconBtnIco:   { fontSize: 24 },
  iconBtnLbl:   { color: '#aaa', fontSize: 10, marginTop: 3 },
  countTxt:     { color: '#FFD60A', fontSize: 22, fontWeight: '700' },

  // carousel
  carousel: {
    position: 'absolute',
    bottom: 134,
    left: 0, right: 0,
    zIndex: 30,
    paddingLeft: 12,
  },
  carouselHdr: { color: '#fff', fontSize: 11, fontWeight: '600', marginBottom: 6, opacity: 0.75 },
  card: {
    backgroundColor: 'rgba(8,8,8,0.85)',
    borderRadius: 12, padding: 11,
    marginRight: 10, width: 216,
    borderWidth: 1, borderColor: 'rgba(90,200,250,0.22)',
  },
  cardTitle: { color: '#fff',    fontSize: 12, fontWeight: '700', marginBottom: 3 },
  cardDate:  { color: '#5AC8FA', fontSize: 10, marginBottom: 3 },
  cardAddr:  { color: '#ddd',    fontSize: 10, lineHeight: 15,   marginBottom: 3 },
  cardCoord: { color: '#FFD60A', fontSize: 10, marginBottom: 2 },
  cardDur:   { color: '#aaa',    fontSize: 10, marginBottom: 3 },
  cardFile:  { color: '#5AC8FA', fontSize: 9,  opacity: 0.7 },
});
