import { FC, useContext, useEffect } from 'react';
import { Device } from 'openvidu-browser';
import { OpenviduContext } from '@/src/contexts/OpenviduContext';

interface DeviceSelectorsProps {
}

const DeviceSelectors: FC<DeviceSelectorsProps> = () => {
  const { audioInputs, videoInputs, getDevices, setDevice } = useContext(OpenviduContext);

  const handleAudioChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const audioInput = audioInputs?.find((device) => device.deviceId === e.target.value);

    if (!audioInput) {
      const emptyDevice: Device = {
        deviceId: '',
        kind: 'audioinput',
        label: '',
      };
      setDevice(emptyDevice);
      return;
    }
    
    setDevice(audioInput);
  };

  const handleVideoChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const videoInput = videoInputs?.find((device) => device.deviceId === e.target.value);

    if (!videoInput) {
      const emptyDevice: Device = {
        deviceId: '',
        kind: 'videoinput',
        label: '',
      };
      setDevice(emptyDevice);
      return;
    }
    
    setDevice(videoInput);
  };

  useEffect(() => {
    getDevices();
  }, [getDevices]);

  return (
    <>
      <div className="flex gap-4 w-full bg-white">
        <select
          onChange={handleAudioChange}
          className="border-2 border-dimmed p-2 w-full rounded-lg truncate">
          <option value="">No Audio</option>
          {audioInputs?.map((device, index) => (
            <option key={index} value={device.deviceId} selected={index === 0}>{device.label}</option>
          ))}
        </select>
        <select
          onChange={handleVideoChange}
          className="border-2 border-dimmed p-2 w-full rounded-lg truncate">
          <option value="">No Video</option>
          {videoInputs?.map((device, index) => (
            <option key={index} value={device.deviceId} selected={index === 0}>{device.label}</option>
          ))}
        </select>
      </div>
    </>
  );
};

export default DeviceSelectors;