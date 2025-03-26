import { useContext, useEffect, useState } from 'react';
import { Device } from 'openvidu-browser';
import { OpenviduContext } from '@/src/contexts/OpenviduContext';

export default function DeviceSelectors() {
  const { audioInputs, videoInputs, getDevices, setDevice } = useContext(OpenviduContext);
  const [selectedAudioId, setSelectedAudioId] = useState<string>('');
  const [selectedVideoId, setSelectedVideoId] = useState<string>(''); 

  /**
   * 장치 선택 핸들러
   * @param devices 장치 목록
   * @param deviceId 선택된 장치 ID
   * @param kind 장치 종류
   */
  const handleChange = (devices: Device[] | undefined, deviceId: string, kind: 'audioinput' | 'videoinput') => {
    const device = devices?.find((device) => device.deviceId === deviceId);

    if (!device) {
      setDevice({ deviceId: '', kind, label: '' });
    } else {
      setDevice(device);
    }
  };

  /**
   * 오디오 장치 선택 핸들러
   * @param e 이벤트 객체
   */
  const handleAudioChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    setSelectedAudioId(value);
    handleChange(audioInputs, value, 'audioinput');
  };

  /**
   * 비디오 장치 선택 핸들러
   * @param e 이벤트 객체
   */
  const handleVideoChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    setSelectedVideoId(value);
    handleChange(videoInputs, value, 'videoinput');
  };

  useEffect(() => {
    getDevices();
  }, []);

  useEffect(() => {
    if (audioInputs && audioInputs.length > 0) {
      setSelectedAudioId(audioInputs[0].deviceId);
      setDevice(audioInputs[0]);
    }

    if (videoInputs && videoInputs.length > 0) {
      setSelectedVideoId(videoInputs[0].deviceId);
      setDevice(videoInputs[0]);
    }
  }, [audioInputs, videoInputs]);

  return (
    <div className="flex gap-4 w-full bg-white">
      {/* 오디오 선택 */}
      <select
        onChange={handleAudioChange}
        value={selectedAudioId}
        className="border-2 border-dimmed p-2 w-full rounded-lg truncate"
      >
        <option value="">No Audio</option>
        {audioInputs?.map((device) => (
          <option key={device.deviceId} value={device.deviceId}>
            {device.label}
          </option>
        ))}
      </select>

      {/* 비디오 선택 */}
      <select
        onChange={handleVideoChange}
        value={selectedVideoId}
        className="border-2 border-dimmed p-2 w-full rounded-lg truncate"
      >
        <option value="">No Video</option>
        {videoInputs?.map((device) => (
          <option key={device.deviceId} value={device.deviceId}>
            {device.label}
          </option>
        ))}
      </select>
    </div>
  );
}