const apiDomain = process.env.NEXT_PUBLIC_API_DOMAIN;

export const connectChatroomListSSE = (
  idx: number,
  callbacks: ChatroomListSSECallbacks
) => {
  const eventSource = new EventSource(`${apiDomain}/chatforyouio/sse/chatroom/list/${idx}`);

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
    const chatrooms = typeof data === "string" ? JSON.parse(data) : data;
    callbacks.onUpdateChatroomList?.(chatrooms);
  });

  eventSource.onerror = (error) => {
    callbacks.onError?.(error);
    eventSource.close();
  };

  return eventSource;
};