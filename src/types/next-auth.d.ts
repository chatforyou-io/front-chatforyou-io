import NextAuth, { Account } from 'next-auth'
import { JWT } from 'next-auth/jwt'

declare module 'next-auth' {
  interface Session {
    token: JWT
  }

  interface User {
    provider: string,
    idx: number,
    id: string,
    pwd: string,
    confirmPwd: string,
    use_pwd: boolean,
    name: string,
    nick_name: string,
    create_date: date,
  }
}