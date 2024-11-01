import NextAuth, { NextAuthOptions } from 'next-auth'
import NaverProvider from 'next-auth/providers/naver'
import KakaoProvider from 'next-auth/providers/kakao'
import GoogleProvider from 'next-auth/providers/google'
import CredentialsProvider from 'next-auth/providers/credentials'
import { addOAuthUser, getOAuthUser, getCredentialsUser } from '@/firebase'
import { userInfo } from '@/src/libs/user'

const NEXTAUTH_URL = process.env.NEXTAUTH_URL;
const BASE_PATH = process.env.NEXT_PUBLIC_BASE_PATH;


const authOptions: NextAuthOptions = {
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
      type: 'credentials',
      id: 'credentials',
      name: 'Credentials',
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

        const { isSuccess, userData } = await userInfo(username, password);
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
      // SNS 로그인 체크
      if (user && account && profile) {
        const snsUser = await getOAuthUser(account.provider, account.providerAccountId);
        console.log(snsUser);
        if (!snsUser) {
          addOAuthUser(user.name!, account.providerAccountId, {
            provider: account.provider,
            providerAccountId: account.providerAccountId
          });  
        }
      }

      // 로그인 제한 로직 (필요 시 활용)
      const isAllowedToSignIn = true;
      if (isAllowedToSignIn) {
        return true
      } else {
        // Return false to display a default error message
        return false
        // Or you can return a URL to redirect to:
        // return '/unauthorized'
      }
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