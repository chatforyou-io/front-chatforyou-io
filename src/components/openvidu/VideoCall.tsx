import React, { useEffect, useRef } from 'react';
import { StreamManager } from 'openvidu-browser';

interface SessionProps {
	streamManager?: StreamManager;
}

export default function UserVideo({ streamManager }: SessionProps) {
	const videoRef = useRef<HTMLVideoElement>(null);
	const autoplay = true;

	useEffect(() => {
		if (streamManager && videoRef.current) {
			streamManager.addVideoElement(videoRef.current);
		}
	}, [streamManager]);
  
  return (
		<video autoPlay={autoplay} ref={videoRef} style={{ width: '100%' }}>
      <track kind="captions" />
    </video>
  );
}