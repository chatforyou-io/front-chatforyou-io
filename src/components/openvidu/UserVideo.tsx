import React from 'react';
import { useState, useEffect } from 'react';
import { Publisher, StreamManager, Subscriber } from 'openvidu-browser';
import Video from '@/src/components/openvidu/VideoCall';

interface SessionProps {
	subscribers: StreamManager[];
	publisher: Publisher;
}

export default function UserVideo({ subscribers, publisher }: SessionProps) {
  return (
    <div>
      <div>
        <Video streamManager={publisher} />
      </div>
      {subscribers.map(subscriberItem => (
        <div key={subscriberItem.id}>
          <Video streamManager={subscriberItem} />
        </div>
      ))}
    </div>
  );
}