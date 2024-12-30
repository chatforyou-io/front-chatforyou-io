import NextAuth, { NextAuthOptions } from "next-auth"
import NaverProvider from "next-auth/providers/naver"
import KakaoProvider from "next-auth/providers/kakao"
import GoogleProvider from "next-auth/providers/google"
import CredentialsProvider from "next-auth/providers/credentials"
import { login, socialLogin } from "@/src/libs/auth"

const NEXTAUTH_URL = process.env.NEXTAUTH_URL;
const BASE_PATH = process.env.NEXT_PUBLIC_BASE_PATH;


export const authOptions: NextAuthOptions = {
  providers: [
    KakaoProvider({
      clientId: process.env.KAKAO_CLIENT_ID!,
      clientSecret: process.env.KAKAO_CLIENT_SECRET!,
    }),
    NaverProvider({
      clientId: process.env.NAVER_CLIENT_ID!,
      clientSecret: process.env.NAVER_CLIENT_SECRET!,
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    CredentialsProvider({
      type: "credentials",
      id: "credentials",
      name: "Credentials",
      credentials: {
        username: {},
        password: {}
      },
      async authorize(credentials) {
        const { username, password } = credentials as {
          username: string;
          password: string;
        }

        // 아이디와 비밀번호 입력 여부 체크
        if (!username || !password) {
          return null;
        }

        const { isSuccess, userData } = await login(username, password);
        if (!isSuccess) {
          return null;
        }

        // 회원 조회 (User 객체 또는 null 반환)
        return userData;
      }
    })
  ],
  callbacks: {
    async signIn({ user, account, profile }) {
      if (account?.type === "credentials") {
        return true;
      }

      if (!user || !account || !profile) {
        return false;
      }

      let email, name;
      switch (account.provider) {
        case "naver":
          email = profile.response.email;
          name = profile.response.name;
          break;
        case "kakao":
          email = profile.kakao_account.email;
          name = user.name;
          break;
        case "google":
          email = profile.email;
          name = user.name;
          break;
      }
      const { isSuccess, userData } = await socialLogin(account.provider, account.providerAccountId, email, name, undefined);
      if (!isSuccess) {
        return false;
      }

      Object.assign(user, userData);

      return true;
    },
    async jwt({ token, user }) {
      if (user) {
        token = { ...token, ...user };
      }
      return token;
    },
    async session({ session, token }) {
      session.user = token;
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
  session: {
    maxAge: 60 * 60, // 1 hour
    updateAge: 24 * 60 * 60, // 24 hours
  },
}

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST }