// src/contexts/AuthContext.tsx
import { useSession } from 'next-auth/react';
import { OpenVidu, Publisher, Session, Subscriber } from 'openvidu-browser';
import { createContext, useState, ReactNode, FC, useRef, useCallback } from 'react';
import { chatroomToken } from '@/src/libs/chatroom';

interface OpenviduContextType {
  ov: OpenVidu | undefined;
  session: Session | undefined;
  publisher: Publisher | undefined;
  subscribers: Subscriber[] | undefined;
  joinSession: () => void;
  leaveSession: () => void;
}

const OpenviduContext = createContext<OpenviduContextType | null>(null);

const OpenviduProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const { data: userSession } = useSession();
  
  const ov = useRef<OpenVidu>();
  const session = useRef<Session>();
  const [publisher, setPublisher] = useState<Publisher>();
  const [subscribers, setSubscribers] = useState<Subscriber[]>([]);

  const requestToken = () => {};

  const joinSession = () => {
    ov.current = new OpenVidu();
    ov.current.enableProdMode();

    session.current = ov.current.initSession();
    
    session.current.on('streamCreated', (event) => {
      const subscriber = session.current!.subscribe(event.stream, undefined);
      setSubscribers((prevSubscribers) => [...prevSubscribers, subscriber]);
    });

    session.current.on('streamDestroyed', (event) => {
      setSubscribers((prevSubscribers) => prevSubscribers.filter((subscriber) => subscriber !== event.stream.streamManager));
    });

    // session.current.connect(token, { clientData: sessionId });
  };

  const leaveSession = () => {
    // leaveSession
  };

  return (
    <OpenviduContext.Provider value={{ ov: ov.current, session: session.current, publisher, subscribers, joinSession, leaveSession }}>
      {children}
    </OpenviduContext.Provider>
  );
};

export default OpenviduProvider;