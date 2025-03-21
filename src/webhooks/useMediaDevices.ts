import { useState, useEffect, useCallback } from 'react';

interface MediaDeviceInfo {
  deviceId: string | undefined;
  kind: MediaDeviceKind;
  label: string | undefined;
  groupId: string | undefined;
}

interface UseMediaDevicesReturn {
  audioInputDevices: MediaDeviceInfo[];
  videoInputDevices: MediaDeviceInfo[];
  audioOutputDevices: MediaDeviceInfo[];
  error: Error | null;
  refreshDevices: () => Promise<void>;
}

export function useMediaDevices(): UseMediaDevicesReturn {
  const [audioInputDevices, setAudioInputDevices] = useState<MediaDeviceInfo[]>([]);
  const [videoInputDevices, setVideoInputDevices] = useState<MediaDeviceInfo[]>([]);
  const [audioOutputDevices, setAudioOutputDevices] = useState<MediaDeviceInfo[]>([]);
  const [error, setError] = useState<Error | null>(null);

  const getDevices = useCallback(async () => {
    try {
      const devices = await navigator.mediaDevices.enumerateDevices();
      
      setAudioInputDevices(devices.filter(device => device.kind === 'audioinput'));
      setVideoInputDevices(devices.filter(device => device.kind === 'videoinput'));
      setAudioOutputDevices(devices.filter(device => device.kind === 'audiooutput'));
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to enumerate devices'));
    }
  }, []);

  useEffect(() => {
    getDevices();

    // 장치 변경 이벤트 리스너 추가
    navigator.mediaDevices.addEventListener('devicechange', getDevices);

    // 클린업 함수
    return () => {
      navigator.mediaDevices.removeEventListener('devicechange', getDevices);
    };
  }, [getDevices]);

  const refreshDevices = useCallback(async () => {
    await getDevices();
  }, [getDevices]);

  return {
    audioInputDevices,
    videoInputDevices,
    audioOutputDevices,
    error,
    refreshDevices,
  };
}