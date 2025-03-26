import { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { OpenVidu, Session, Publisher, Subscriber } from 'openvidu-browser';
import { chatroomToken } from '@/src/libs/chatroom';

interface UseOpenViduProps {
  sessionId: string;
  userIdx: number;
}

interface UseOpenViduReturn {
  session?: Session;
  publisher?: Publisher;
  subscribers: Subscriber[];
  joinSession: () => void;
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
        throw new Error('세션 정보와 사용자 정보가 필요합니다.');
      }

      const token = await getToken();
      
      if (!token) {
        throw new Error('토큰이 없습니다.');
      }
      
      if (!ovRef.current) {
        ovRef.current = new OpenVidu();
        ovRef.current.enableProdMode();
      }

      const session = ovRef.current.initSession();
      sessionRef.current = session;

      session.on('streamCreated', (event) => {
        const subscriber = session.subscribe(event.stream, undefined);
        setSubscribers((prev) => [...prev, subscriber]);
      });

      session.on('streamDestroyed', (event) => {
        setSubscribers((prev) =>
          prev.filter((subscriber) => subscriber !== event.stream.streamManager)
        );
      });

      await session.connect(token, { clientData: sessionId });

      const newPublisher = ovRef.current.initPublisher(undefined, {
        audioSource: undefined,
        videoSource: undefined,
        publishAudio: true,
        publishVideo: true,
        resolution: '640x480',
        frameRate: 30,
        insertMode: 'APPEND',
      });

      await session.publish(newPublisher);

      setSession(session);
      setPublisher(newPublisher);
    } catch (error) {
      console.error('세션 참여에 실패했습니다.', error);
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
    return () => leaveSession();
  }, [leaveSession]);

  return useMemo(
    () => ({
      session,
      publisher,
      subscribers,
      joinSession,
      leaveSession,
    }),
    [session, publisher, subscribers, joinSession, leaveSession]
  );
};