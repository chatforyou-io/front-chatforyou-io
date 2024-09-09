import { useState, useEffect, useCallback } from 'react';
import { OpenVidu, Session, Publisher, Subscriber } from 'openvidu-browser';
import { requestToken } from '@/src/libs/openvidu';

interface UseOpenViduProps {
  sessionId: string;
  userIdx: number;
}

interface UseOpenViduReturn {
  session: Session | undefined;
  publisher: Publisher | undefined;
  subscribers: Subscriber[];
  joinSession: () => Promise<void>;
  leaveSession: () => void;
}

export const useOpenvidu = ({ sessionId, userIdx }: UseOpenViduProps): UseOpenViduReturn => {
  const [session, setSession] = useState<Session>();
  const [publisher, setPublisher] = useState<Publisher>();
  const [subscribers, setSubscribers] = useState<Subscriber[]>([]);

  const joinSession = useCallback(async () => {
    try {
      if (!sessionId || !userIdx) {
        throw new Error('sessionId and userIdx must be provided');
      }

      const token = await requestToken(sessionId, userIdx);

      const ov = new OpenVidu();
      const session = ov.initSession();

      session.on('streamCreated', (event) => {
        const subscriber = session.subscribe(event.stream, undefined);
        setSubscribers((prevSubscribers) => [...prevSubscribers, subscriber]);
      });

      session.on('streamDestroyed', (event) => {
        setSubscribers((prevSubscribers) => prevSubscribers.filter((subscriber) => subscriber !== event.stream.streamManager));
      });

      await session.connect(token, { clientData: sessionId });

      const publisher = ov.initPublisher(undefined, {
        audioSource: undefined,
        videoSource: undefined,
        publishAudio: true,
        publishVideo: true,
        resolution: '640x480',
        frameRate: 30,
        insertMode: 'APPEND',
      });

      await session.publish(publisher);

      setSession(session);
      setPublisher(publisher);
    } catch (error) {
      console.error('Error joining session:', error);
    }
  }, [sessionId, userIdx]);

  const leaveSession = useCallback(() => {
    if (session) {
      session.disconnect();
      setSession(undefined);
      setPublisher(undefined);
      setSubscribers([]);
    }
  }, [session]);

  useEffect(() => {
    return () => {
      leaveSession();
    };
  }, [leaveSession]);

  return {
    session,
    publisher,
    subscribers,
    joinSession,
    leaveSession,
  };
};