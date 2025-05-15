import React, { useEffect, useRef } from 'react';
import { StreamManager } from 'openvidu-browser';
import IconLoader from "@/public/images/icons/loader.svg";

interface SessionProps {
	streamManager?: StreamManager;
}

export default function OpenviduStream({ streamManager }: SessionProps) {
	const videoRef = useRef<HTMLVideoElement>(null);
	const autoplay = true;

	useEffect(() => {
		if (streamManager && videoRef.current) {
			streamManager.addVideoElement(videoRef.current);
		}
	}, [streamManager]);

  if (!streamManager) {
    return (
      <div className="flex justify-center items-center w-full aspect-video bg-gray-200 rounded-2xl">
        <IconLoader className="w-12 h-12 animate-spin" />
      </div>
    );
  }
  
  return (
		<video autoPlay={autoplay} ref={videoRef} className="w-full rounded-2xl">
      <track kind="captions" />
    </video>
  );
}