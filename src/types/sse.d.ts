interface SSECallbacks {
  onConnectionStatus?: (status: string) => void;
  onKeepAlive?: (message: string) => void;
  onError?: (error: Event) => void;
}

interface ChatroomListSSECallbacks extends SSECallbacks {
  onUpdateChatroomList?: (chatrooms: Chatroom[]) => void;
}

interface ChatroomInfoSSECallbacks extends SSECallbacks {
  onUpdateChatroomInfo?: (chatroom: Chatroom) => void;
}

interface UserListSSECallbacks extends SSECallbacks {
  onUpdateUserList?: (users: { userList: User[], loginUserList: User[] }) => void;
}
