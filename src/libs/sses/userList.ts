const apiDomain = process.env.NEXT_PUBLIC_API_DOMAIN;

export const connectUserListSSE = (
  idx: number,
  callbacks: UserListSSECallbacks
) => {
  const eventSource = new EventSource(`${apiDomain}/chatforyouio/sse/user/list/${idx}`);

  eventSource.addEventListener("connectionStatus", (event) => {
    const { data } = JSON.parse(event.data);
    callbacks.onConnectionStatus?.(data);
  });

  eventSource.addEventListener("keepAlive", (event) => {
    const { data } = JSON.parse(event.data);
    callbacks.onKeepAlive?.(data);
  });

  eventSource.addEventListener("updateUserList", (event) => {
    console.log("updateUserList", event);
    const { data } = JSON.parse(event.data);
    console.log("data", data);
    const users = typeof data === "string" ? JSON.parse(data) : data;
    callbacks.onUpdateUserList?.(users);
  });

  eventSource.onerror = (error) => {
    callbacks.onError?.(error);
    eventSource.close();
  };

  return eventSource;
};