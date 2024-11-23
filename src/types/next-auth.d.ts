import "next-auth";
import "next-auth/jwt";

declare module "next-auth" {
  interface Profile {
    response: any;
    kakao_account: any;
  }

  interface Session {
    user: JWT & DefaultSession["user"]
  }
}

declare module "next-auth/jwt" {
  interface JWT extends User {}
}