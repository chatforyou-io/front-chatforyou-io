export const connectChatroomListSSE = (
  idx: number,
  callbacks: ChatroomListSSECallbacks
) => {
  const eventSource = new EventSource(`/sse/chatroom/list/${idx}`);

  eventSource.addEventListener("connectionStatus", (event) => {
    const { data } = JSON.parse(event.data);
    callbacks.onConnectionStatus?.(data);
  });

  eventSource.addEventListener("keepAlive", (event) => {
    const { data } = JSON.parse(event.data);
    callbacks.onKeepAlive?.(data);
  });

  eventSource.addEventListener("updateChatroomList", (event) => {
    const { data } = JSON.parse(event.data);
    callbacks.onUpdateChatroomList?.(data);
  });

  eventSource.onerror = (error) => {
    callbacks.onError?.(error);
    eventSource.close();
  };

  return eventSource;
};