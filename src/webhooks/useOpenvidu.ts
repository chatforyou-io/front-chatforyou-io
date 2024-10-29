import { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { OpenVidu, Session, Publisher, Subscriber } from 'openvidu-browser';
import { chatroomToken } from '@/src/libs/chatroom';

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
  
  const ovRef = useRef<OpenVidu>();
  const sessionRef = useRef<Session>();

  const getToken = useCallback(() => chatroomToken(sessionId, userIdx), [sessionId, userIdx]);

  const joinSession = useCallback(async () => {
    try {
      if (!sessionId || !userIdx) {
        throw new Error('sessionId and userIdx must be provided');
      }

      const token = await getToken();
      
      if (!token) {
        throw new Error('Token is empty');
      }
      
      if (!ovRef.current) {
        ovRef.current = new OpenVidu();
      }

      sessionRef.current = ovRef.current.initSession();

      sessionRef.current.on('streamCreated', (event) => {
        const subscriber = sessionRef.current!.subscribe(event.stream, undefined);
        setSubscribers((prevSubscribers) => [...prevSubscribers, subscriber]);
      });

      sessionRef.current.on('streamDestroyed', (event) => {
        setSubscribers((prevSubscribers) => prevSubscribers.filter((subscriber) => subscriber !== event.stream.streamManager));
      });

      await sessionRef.current.connect(token, { clientData: sessionId });

      const newPublisher = ovRef.current.initPublisher(undefined, {
        audioSource: undefined,
        videoSource: undefined,
        publishAudio: true,
        publishVideo: true,
        resolution: '640x480',
        frameRate: 30,
        insertMode: 'APPEND',
      });

      await sessionRef.current.publish(newPublisher);

      setSession(sessionRef.current);
      setPublisher(newPublisher);
    } catch (error) {
      console.error('Error joining session:', error);
    }
  }, [sessionId, userIdx, getToken]);

  const leaveSession = useCallback(() => {
    if (sessionRef.current) {
      sessionRef.current.disconnect();
      sessionRef.current = undefined;
    }
    setSession(undefined);
    setPublisher(undefined);
    setSubscribers([]);
    ovRef.current = undefined;
  }, []);

  useEffect(() => {
    return () => {
      leaveSession();
    };
  }, [leaveSession]);

  return useMemo(() => ({
    session,
    publisher,
    subscribers,
    joinSession,
    leaveSession,
  }), [session, publisher, subscribers, joinSession, leaveSession]);
};