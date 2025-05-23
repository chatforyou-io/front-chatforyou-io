interface User {
  idx: number;
  id: string;
  pwd: string;
  name: string;
  nickName: string;
  provider: string;
  friendList?: string
  createDate?: string
  lastLoginDate: number;
}