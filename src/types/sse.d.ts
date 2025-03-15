interface SSECallbacks {
  onConnectionStatus?: (status: string) => void;
  onKeepAlive?: (message: string) => void;
  onError?: (error: Event) => void;
}

interface ChatroomListSSECallbacks extends SSECallbacks {
  onUpdateChatroomList?: (data: { chatrooms: Chatroom[] }) => void;
}

interface ChatroomInfoSSECallbacks extends SSECallbacks {
  onUpdateChatroomInfo?: (chatroom: Chatroom) => void;
}