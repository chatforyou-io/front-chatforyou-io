'use client';

import { Device, OpenVidu, Publisher, Session, StreamManager, Subscriber } from 'openvidu-browser';
import { ChangeEvent, FormEvent, useEffect, useRef, useState } from "react";

type SessionState = {
  sessionId: string,
  userName: string,
  session: Session | undefined,
  currentVideoDevice: Device | undefined,
  mainStreamManager: StreamManager | undefined,
  publisher: Publisher | undefined,
  subscribers: Subscriber[],
}

export default function ChatRoom() {  
  const ovRef = useRef<OpenVidu | null>(null);
  const [sessionState, setSessioState] = useState<SessionState>({
    sessionId: '',
    userName: '',
    session: undefined,
    currentVideoDevice: undefined,
    mainStreamManager: undefined,
    publisher: undefined,
    subscribers: [],
  });

  const joinSession = async (event: FormEvent) => {
    event.preventDefault();

    // --- 2) Init a session ---
    const sessionObj = sessionState;
    if (!sessionObj.session) {
      sessionObj.session = ovRef.current?.initSession();
      setSessioState(sessionObj);
    };
    if (!sessionObj.session) {
      return;
    };
    const session = sessionObj.session;

    // --- 3) Specify the actions when events take place in the session ---
    // On every new Stream received...
    session.on('streamCreated', (event) => {
      // Subscribe to the Stream to receive it. Second parameter is undefined
      // so OpenVidu doesn't create an HTML video by its own
      const sessionObj = sessionState;
      if (!sessionObj.session) {
        return;
      }

      const subscriber = sessionObj.session.subscribe(event.stream, undefined);
      sessionObj.subscribers.push(subscriber);

      setSessioState(sessionObj);
    });

    // On every Stream destroyed...
    session.on('streamDestroyed', (event) => {
      const sessionObj = sessionState;
      if (!sessionObj.session) {
        return;
      }

      // Remove the stream from 'subscribers' array
      const streamManager = event.stream.streamManager;

      const subscribers = sessionObj.subscribers;
      const index = subscribers.indexOf(streamManager as Subscriber, 0);
      if (index > -1) {
        subscribers.splice(index, 1);
        sessionObj.subscribers = subscribers;

        setSessioState(sessionObj);
      }
    });

    // On every asynchronous exception...
    session.on('exception', (exception) => {
      console.warn(exception);
    });

    // --- 4) Connect to the session with a valid user token ---
    // Get a token from the OpenVidu deployment
    getToken().then((token) => {
      const sessionObj = sessionState;
      if (!sessionObj.session) {
        return;
      }
      const session = sessionObj.session;
      
      // First param is the token got from the OpenVidu deployment. Second param can be retrieved by every user on event
      // 'streamCreated' (property Stream.connection.data), and will be appended to DOM as the user's nickname
      session
        .connect(token, { clientData: sessionObj.userName })
        .then(async () => {
          // --- 5) Get your own camera stream ---
          // Init a publisher passing undefined as targetElement (we don't want OpenVidu to insert a video
          // element: we will manage it on our own) and with the desired properties
          let publisher = await ovRef.current!.initPublisherAsync(undefined, {
            audioSource: undefined, // The source of audio. If undefined default microphone
            videoSource: undefined, // The source of video. If undefined default webcam
            publishAudio: true, // Whether you want to start publishing with your audio unmuted or not
            publishVideo: true, // Whether you want to start publishing with your video enabled or not
            resolution: '640x480', // The resolution of your video
            frameRate: 30, // The frame rate of your video
            insertMode: 'APPEND', // How the video is inserted in the target element 'video-container'
            mirror: false, // Whether to mirror your local video or not
          });

          // --- 6) Publish your stream ---
          session.publish(publisher);

          // Obtain the current video device in use
          const devices = await ovRef.current!.getDevices();
          const videoDevices = devices.filter(device => device.kind === 'videoinput');
          const currentVideoDeviceId = publisher.stream.getMediaStream().getVideoTracks()[0].getSettings().deviceId;
          const currentVideoDevice = videoDevices.find(device => device.deviceId === currentVideoDeviceId);

          // Set the main video in the page to display our webcam and store our Publisher
          sessionObj.currentVideoDevice = currentVideoDevice;
          sessionObj.mainStreamManager = publisher;
          sessionObj.publisher = publisher;
          setSessioState(sessionObj);
        })
        .catch((error) => {
          console.log('There was an error connecting to the session:', error.code, error.message);
        });
    });
  }
  
  useEffect(() => {
    // --- 1) Get an OpenVidu object ---
    ovRef.current = new OpenVidu();
  }, []);

  const handleChangeUserName = (event: ChangeEvent<HTMLInputElement>) => {
    const sessionObj = sessionState;
    sessionObj.userName = event.target.value;

    setSessioState(sessionObj);
  }

  const handleChangeSessionId = (event: ChangeEvent<HTMLInputElement>) => {
    const sessionObj = sessionState;
    sessionObj.sessionId = event.target.value;

    setSessioState(sessionObj);
  }

  function deleteSubscriber(streamManager: StreamManager) {
    throw new Error('Function not implemented.');
  }
  
  /**
   * --------------------------------------------
   * GETTING A TOKEN FROM YOUR APPLICATION SERVER
   * --------------------------------------------
   * The methods below request the creation of a Session and a Token to
   * your application server. This keeps your OpenVidu deployment secure.
   *
   * In this sample code, there is no user control at all. Anybody could
   * access your application server endpoints! In a real production
   * environment, your application server must identify the user to allow
   * access to the endpoints.
   *
   * Visit https://docs.openvidu.io/en/stable/application-server to learn
   * more about the integration of OpenVidu in your application server.
   */
  async function getToken() {
    const sessionObj = sessionState;
    if (!sessionObj.session) {
      return;
    }
    
    const sessionId = await createSession(sessionObj.sessionId);
    const token = await createToken(sessionId);
    return token;
  }

  async function createSession(customSessionId: string) {
    const session = await fetch('/api/openvidu/sessions', {
      method: 'POST',
      headers: {
        'customSessionId': customSessionId
      },
    })
      .then(response => response.json());
    return session.id;
  }

  async function createToken(sessionId: string) {
    const data = await fetch('/api/openvidu/sessions/' + sessionId + '/connections', {
      method: 'POST',
    })
      .then(response => response.json());
    return data;
  }

  return (
    <div className="p-4">
      <h1> Join a video session </h1>
      <form className="form-group" onSubmit={joinSession}>
        <p>
          <label>Participant: </label>
          <input
            type="text"
            onChange={handleChangeUserName}
            className='border'
            required
          />
        </p>
        <p>
          <label> Session: </label>
          <input
            type="text"
            onChange={handleChangeSessionId}
            className='border'
            required
          />
        </p>
        <p className="text-center">
          <input className="btn btn-lg btn-success" name="commit" type="submit" value="JOIN" />
        </p>
      </form>
    </div>
  );
}