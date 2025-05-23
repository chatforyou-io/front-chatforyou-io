import { useOpenVidu } from "@/src/contexts/OpenViduContext";

export default function OpenViduDevices() {
  const { audioDevices, videoDevices, setDevice } = useOpenVidu();

  const handleAudioChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const audioInput = audioDevices?.find((device) => device.deviceId === e.target.value);
    if (!audioInput) return;
    
    setDevice(audioInput);
  };

  const handleVideoChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const videoInput = videoDevices?.find((device) => device.deviceId === e.target.value);
    if (!videoInput) return;

    setDevice(videoInput);
  };

  return (
    <div className="flex gap-4 w-full bg-white">
      <select
        onChange={handleAudioChange}
        className="border border-primary p-2 w-full rounded-2xl shadow-md truncate">
        {audioDevices?.map((device) => (
          <option key={device.deviceId} className="text-sm" value={device.deviceId}>{device.label}</option>
        ))}
      </select>
      <select
        onChange={handleVideoChange}
        className="border border-primary p-2 w-full rounded-2xl shadow-md truncate">
        {videoDevices?.map((device) => (
          <option key={device.deviceId} className="text-sm" value={device.deviceId}>{device.label}</option>
        ))}
      </select>
    </div>
  );
};