export const connectChatroomInfoSSE = (
  sessionId: string,
  idx: number,
  callbacks: ChatroomInfoSSECallbacks
) => {
  const eventSource = new EventSource(`/chatroom/${sessionId}/user/${idx}`);

  eventSource.addEventListener("connectionStatus", (event) => {
    const { data } = JSON.parse(event.data);
    callbacks.onConnectionStatus?.(data);
  });

  eventSource.addEventListener("keepAlive", (event) => {
    const { data } = JSON.parse(event.data);
    callbacks.onKeepAlive?.(data);
  });

  eventSource.addEventListener("updateChatroomInfo", (event) => {
    const { data } = JSON.parse(event.data);
    callbacks.onUpdateChatroomInfo?.(data);
  });

  eventSource.onerror = (error) => {
    callbacks.onError?.(error);
    eventSource.close();
  };

  return eventSource;
};
