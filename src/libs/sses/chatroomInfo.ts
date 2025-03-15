const apiDomain = process.env.NEXT_PUBLIC_API_DOMAIN;
export const connectChatroomInfoSSE = (
  sessionId: string,
  idx: number,
  callbacks: ChatroomInfoSSECallbacks
) => {
  const eventSource = new EventSource(`${apiDomain}/chatforyouio/sse/chatroom/${sessionId}/user/${idx}`);

  eventSource.addEventListener("connectionStatus", (event) => {
    console.log("connectionStatus:", event);
    const { data } = JSON.parse(event.data);
    callbacks.onConnectionStatus?.(data);
  });

  eventSource.addEventListener("keepAlive", (event) => {
    console.log("keepAlive:", event);
    const { data } = JSON.parse(event.data);
    callbacks.onKeepAlive?.(data);
  });

  eventSource.addEventListener("updateChatroomInfo", (event) => {
    console.log("updateChatroomInfo:", event);
    const { data } = JSON.parse(event.data);
    const chatroom = typeof data === "string" ? JSON.parse(data) : data;
    callbacks.onUpdateChatroomInfo?.(chatroom);
  });

  eventSource.onerror = (error) => {
    console.log("onerror:", error);
    callbacks.onError?.(error);
    eventSource.close();
  };

  return eventSource;
};
