const apiDomain = process.env.NEXT_PUBLIC_API_DOMAIN;

export const connectChatroomListSSE = (
  idx: number,
  callbacks: ChatroomListSSECallbacks
) => {
  const eventSource = new EventSource(`${apiDomain}/chatforyouio/sse/chatroom/list/${idx}`);

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

  eventSource.addEventListener("updateChatroomList", (event) => {
    console.log("updateChatroomList:", event);
    const { response } = JSON.parse(event.data);
    const { data } = response;
    const { chatrooms } = data;
    callbacks.onUpdateChatroomList?.(chatrooms);
  });

  eventSource.onerror = (error) => {
    console.log("onerror:", error);
    callbacks.onError?.(error);
    eventSource.close();
  };

  return eventSource;
};