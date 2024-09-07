import { useState, useEffect, useCallback } from 'react';
import { OpenVidu, Session, Publisher, Subscriber } from 'openvidu-browser';
import { createToken } from '@/src/libs/openvidu';

interface UseOpenViduProps {
  sessionId: string;
}

interface UseOpenViduReturn {
  session: Session | undefined;
  publisher: Publisher | undefined;
  subscribers: Subscriber[];
  joinSession: () => Promise<void>;
  leaveSession: () => void;
}

export const useOpenvidu = ({ sessionId }: UseOpenViduProps): UseOpenViduReturn => {
  const [session, setSession] = useState<Session>();
  const [token, setToken] = useState<string>();
  const [publisher, setPublisher] = useState<Publisher>();
  const [subscribers, setSubscribers] = useState<Subscriber[]>([]);

  const getToken = useCallback(async () => {
    return await createToken(sessionId);
  }, [sessionId]);

  const joinSession = useCallback(async () => {
    try {
      const token = await getToken();
      console.log(token);
      setToken(token);

      const ov = new OpenVidu();
      const session = ov.initSession();

      setSession(session);

      session.on('streamCreated', (event) => {
        const subscriber = session.subscribe(event.stream, undefined);
        setSubscribers((prevSubscribers) => [...prevSubscribers, subscriber]);
      });

      session.on('streamDestroyed', (event) => {
        setSubscribers((prevSubscribers) =>
          prevSubscribers.filter((sub) => sub !== event.stream.streamManager)
        );
      });

      await session.connect(token);

      const publisher = await ov.initPublisherAsync(undefined, {
        audioSource: undefined,
        videoSource: undefined,
        publishAudio: true,
        publishVideo: true,
        resolution: '640x480',
        frameRate: 30,
        insertMode: 'APPEND',
        mirror: false,
      });

      await session.publish(publisher);
      setPublisher(publisher);
    } catch (error) {
      console.error('Error joining session:', error);
    }
  }, [sessionId, getToken]);

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