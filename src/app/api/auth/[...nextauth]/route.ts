import { authOptions } from "@/src/libs/utils/authOption";
import NextAuth from "next-auth"

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST }