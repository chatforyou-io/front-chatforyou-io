import React from 'react';
import { useState, useEffect } from 'react';
import { Publisher, Subscriber } from 'openvidu-browser';
import Video from '@/components/openvidu/VideoCall';

interface SessionProps {
	subscribers: Subscriber[];
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