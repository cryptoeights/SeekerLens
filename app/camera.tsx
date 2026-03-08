import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';
import * as Location from 'expo-location';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { X } from 'lucide-react-native';

import { Button } from '@/components/ui/Button';
import { COLORS, SPACING, TYPOGRAPHY } from '@/lib/constants';

interface LocationData {
  readonly latitude: number;
  readonly longitude: number;
  readonly locationName: string;
}

const CAPTURE_BUTTON_SIZE = 70;
const CAPTURE_BUTTON_BORDER = 4;

export default function CameraScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const params = useLocalSearchParams<{ mode?: string; bountyId?: string }>();

  const cameraRef = useRef<CameraView>(null);
  const [cameraPermission, requestCameraPermission] = useCameraPermissions();
  const [location, setLocation] = useState<LocationData | null>(null);
  const [isCapturing, setIsCapturing] = useState(false);
  const [hasLocationPermission, setHasLocationPermission] = useState(false);

  useEffect(() => {
    let mounted = true;

    async function initLocation() {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted' || !mounted) return;

      setHasLocationPermission(true);

      const position = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.High,
      });

      if (!mounted) return;

      let locationName = `${position.coords.latitude.toFixed(3)}, ${position.coords.longitude.toFixed(3)}`;

      try {
        const [geocode] = await Location.reverseGeocodeAsync({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        });
        if (geocode && mounted) {
          const parts = [geocode.city, geocode.region].filter(Boolean);
          if (parts.length > 0) {
            locationName = parts.join(', ');
          }
        }
      } catch {
        // Keep raw coords as fallback
      }

      if (mounted) {
        setLocation({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          locationName,
        });
      }
    }

    initLocation();
    return () => { mounted = false; };
  }, []);

  const handleCapture = useCallback(async () => {
    if (!cameraRef.current || isCapturing) return;

    setIsCapturing(true);
    try {
      const photo = await cameraRef.current.takePictureAsync({ quality: 0.8 });
      if (!photo) return;

      const baseParams = {
        imageUri: photo.uri,
        latitude: String(location?.latitude ?? ''),
        longitude: String(location?.longitude ?? ''),
        locationName: location?.locationName ?? '',
      };

      const mode = params.mode ?? 'marketplace';

      if (mode === 'bounty' && params.bountyId) {
        router.push({
          pathname: '/content/post',
          params: { ...baseParams, bountyId: params.bountyId },
        });
      } else {
        router.push({
          pathname: '/content/post',
          params: baseParams,
        });
      }
    } catch (error) {
      console.error('Failed to capture photo:', error);
    } finally {
      setIsCapturing(false);
    }
  }, [isCapturing, location, params.mode, params.bountyId, router]);

  const handleClose = useCallback(() => {
    router.back();
  }, [router]);

  // Permission not yet determined or denied
  if (!cameraPermission?.granted) {
    return (
      <View style={[styles.permissionContainer, { paddingTop: insets.top }]}>
        <Text style={styles.permissionTitle}>Camera Access Required</Text>
        <Text style={styles.permissionDescription}>
          SeekerLens needs camera access to capture photos for bounties and the
          marketplace.
        </Text>
        <Button
          title="Grant Camera Access"
          onPress={requestCameraPermission}
          fullWidth
        />
        <Button
          title="Go Back"
          onPress={handleClose}
          variant="ghost"
          style={styles.backButton}
        />
      </View>
    );
  }

  const coordsText = location
    ? `${location.latitude.toFixed(3)}, ${location.longitude.toFixed(3)}`
    : 'Acquiring...';

  return (
    <View style={styles.container}>
      {/* Top bar */}
      <View style={[styles.topBar, { paddingTop: insets.top + SPACING.sm }]}>
        <TouchableOpacity onPress={handleClose} style={styles.closeButton}>
          <X size={24} color={COLORS.white} strokeWidth={2} />
        </TouchableOpacity>
        <View style={styles.gpsIndicator}>
          <View
            style={[
              styles.gpsDot,
              { backgroundColor: hasLocationPermission ? '#10B981' : COLORS.warning },
            ]}
          />
          <Text style={styles.gpsText}>
            {hasLocationPermission ? 'GPS \u2713 Live' : 'GPS Pending'}
          </Text>
        </View>
      </View>

      {/* Camera preview */}
      <View style={styles.cameraWrapper}>
        <CameraView
          ref={cameraRef}
          style={styles.camera}
          facing="back"
        />
      </View>

      {/* Location bar */}
      <View style={styles.locationBar}>
        <Text style={styles.locationName}>
          {'\uD83D\uDCCD'} {location?.locationName ?? 'Locating...'}
        </Text>
        <Text style={styles.locationCoords}>{coordsText}</Text>
      </View>

      {/* Capture area */}
      <View style={[styles.captureArea, { paddingBottom: insets.bottom + SPACING.xl }]}>
        <TouchableOpacity
          style={styles.captureButton}
          onPress={handleCapture}
          disabled={isCapturing}
          activeOpacity={0.7}
        >
          <View
            style={[
              styles.captureButtonInner,
              isCapturing ? styles.captureButtonCapturing : undefined,
            ]}
          />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.black,
  },
  // Permission screen
  permissionContainer: {
    flex: 1,
    backgroundColor: COLORS.black,
    justifyContent: 'center',
    alignItems: 'center',
    padding: SPACING.screenPadding,
  },
  permissionTitle: {
    ...TYPOGRAPHY.heading2,
    color: COLORS.white,
    textAlign: 'center',
    marginBottom: SPACING.md,
  },
  permissionDescription: {
    ...TYPOGRAPHY.body,
    color: COLORS.textTertiary,
    textAlign: 'center',
    marginBottom: SPACING.sectionGap,
    lineHeight: 24,
  },
  backButton: {
    marginTop: SPACING.md,
    alignSelf: 'center',
  },
  // Top bar
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: SPACING.screenPadding,
    paddingBottom: SPACING.sm,
  },
  closeButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0,0,0,0.4)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  gpsIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.4)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    gap: 6,
  },
  gpsDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  gpsText: {
    ...TYPOGRAPHY.caption,
    color: '#10B981',
  },
  // Camera
  cameraWrapper: {
    flex: 1,
    overflow: 'hidden',
    borderRadius: 12,
    marginHorizontal: SPACING.sm,
  },
  camera: {
    flex: 1,
  },
  // Location bar
  locationBar: {
    paddingHorizontal: SPACING.screenPadding,
    paddingVertical: SPACING.md,
  },
  locationName: {
    ...TYPOGRAPHY.body,
    color: COLORS.white,
    marginBottom: 2,
  },
  locationCoords: {
    ...TYPOGRAPHY.caption,
    color: COLORS.textTertiary,
  },
  // Capture
  captureArea: {
    alignItems: 'center',
    paddingTop: SPACING.lg,
  },
  captureButton: {
    width: CAPTURE_BUTTON_SIZE,
    height: CAPTURE_BUTTON_SIZE,
    borderRadius: CAPTURE_BUTTON_SIZE / 2,
    borderWidth: CAPTURE_BUTTON_BORDER,
    borderColor: COLORS.white,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 3,
  },
  captureButtonInner: {
    width: '100%',
    height: '100%',
    borderRadius: CAPTURE_BUTTON_SIZE / 2,
    backgroundColor: COLORS.white,
  },
  captureButtonCapturing: {
    backgroundColor: COLORS.textTertiary,
  },
});
