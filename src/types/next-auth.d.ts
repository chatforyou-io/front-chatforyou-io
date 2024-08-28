import NextAuth, { Account } from 'next-auth'
import { JWT } from 'next-auth/jwt'

declare module 'next-auth' {
  interface Session {
    user: {
      idx: number;
      id: string;
    } & DefaultSession["user"]
  }

  interface User {
    provider: any;
    idx: number;
    id: string;
    name: string;
    nickName: string;
  }
}