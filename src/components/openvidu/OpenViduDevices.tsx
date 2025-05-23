import { useOpenVidu } from "@/src/contexts/OpenViduContext";
import IconMic from "@/public/images/icons/mic.svg";
import IconMicOff from "@/public/images/icons/mic-off.svg";
import IconVideo from "@/public/images/icons/video.svg";
import IconVideoOff from "@/public/images/icons/video-off.svg";
import clsx from "clsx";

export default function OpenViduDevices() {
  const {
    audioDevices,
    videoDevices,
    selectedAudio,
    selectedVideo,
    changeAudioDevice,
    changeVideoDevice,
    toggleAudio,
    toggleVideo,
    isAudioEnabled,
    isVideoEnabled,
  } = useOpenVidu();

  return (
    <div className="flex gap-2 w-full bg-white">
      <div className="flex items-center">
        <button
          type="button"
          onClick={toggleAudio}
          className={clsx("flex items-center justify-center w-12 h-12 border border-primary rounded-l-full shadow-md focus:outline-none", {
            "bg-white hover:bg-gray-300 text-primary": isAudioEnabled,
            "bg-primary hover:bg-blue-300 text-white": !isAudioEnabled,
          })}>
          {isAudioEnabled
            ? <IconMic className="w-6 h-6 text-primary" />
            : <IconMicOff className="w-6 h-6 text-white" />}
        </button>
        <select
          value={selectedAudio}
          onChange={(event) => changeAudioDevice(event.target.value)}
          className="border border-primary p-2 w-full h-12 hover:bg-gray-300 rounded-r-full shadow-md truncate">
          {audioDevices?.map((device) => (
            <option key={device.deviceId} className="text-sm" value={device.deviceId}>{device.label}</option>
          ))}
        </select>
      </div>
      <div className="flex items-center">
        <button
          type="button"
          onClick={toggleVideo}
          className={clsx("flex items-center justify-center w-12 h-12 border border-primary rounded-l-full shadow-md focus:outline-none", {
            "bg-white hover:bg-gray-300 text-primary": isVideoEnabled,
            "bg-primary hover:bg-blue-300 text-white": !isVideoEnabled,
          })}>
          {isVideoEnabled
            ? <IconVideo className="w-6 h-6 text-primary" />
            : <IconVideoOff className="w-6 h-6 text-white" />}
        </button>
        <select
          value={selectedVideo}
          onChange={(event) => changeVideoDevice(event.target.value)}
          className="border border-primary p-2 w-full h-12 hover:bg-gray-300 rounded-r-full shadow-md truncate">
          {videoDevices?.map((device) => (
            <option key={device.deviceId} className="text-sm" value={device.deviceId}>{device.label}</option>
          ))}
        </select>
      </div>
    </div>
  );
};