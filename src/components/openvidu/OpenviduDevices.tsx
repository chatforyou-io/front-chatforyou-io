import { useContext, useEffect } from "react";
import { OpenviduContext } from "@/src/contexts/OpenviduContext";

export default function OpenviduDevices() {
  const { audioInputs, videoInputs, getDevices, setDevice } = useContext(OpenviduContext);

  const handleAudioChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const audioInput = audioInputs?.find((device) => device.deviceId === e.target.value);
    if (!audioInput) return;
    
    setDevice(audioInput);
  };

  const handleVideoChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const videoInput = videoInputs?.find((device) => device.deviceId === e.target.value);
    if (!videoInput) return;

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
          className="border-2 border-dimmed p-2 w-full rounded-2xl truncate">
          {audioInputs?.map((device) => (
            <option key={device.deviceId} value={device.deviceId}>{device.label}</option>
          ))}
        </select>
        <select
          onChange={handleVideoChange}
          className="border-2 border-dimmed p-2 w-full rounded-2xl truncate">
          {videoInputs?.map((device) => (
            <option key={device.deviceId} value={device.deviceId}>{device.label}</option>
          ))}
        </select>
      </div>
    </>
  );
};