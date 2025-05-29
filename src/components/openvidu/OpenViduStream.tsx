import React, { useEffect, useRef } from 'react';
import { StreamManager } from 'openvidu-browser';
import IconVideoOff from "@/public/images/icons/video-off.svg";

interface SessionProps {
	streamManager?: StreamManager;
}

export default function OpenViduStream({ streamManager }: SessionProps) {
	const videoRef = useRef<HTMLVideoElement>(null);
	const autoplay = true;

	useEffect(() => {
		if (streamManager && videoRef.current) {
			streamManager.addVideoElement(videoRef.current);
		}
	}, [streamManager]);

  if (!streamManager?.stream.videoActive) {
    return (
      <div className="flex justify-center items-center w-full aspect-video bg-gray-200 rounded-2xl">
        <IconVideoOff className="w-12 h-12" />
      </div>
    );
  }
  
  return (
		<video autoPlay={autoplay} ref={videoRef} className="w-full rounded-2xl">
      <track kind="captions" />
    </video>
  );
}