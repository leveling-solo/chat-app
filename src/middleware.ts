import { withAuth } from "next-auth/middleware";
import { NextRequest } from "next/server";

export default withAuth({
  pages: {
    signIn: "/",
  },
  callbacks: {
    authorized: ({ req, token }: { req: NextRequest; token: any }): boolean => {
      console.log("Middleware running for : ", req.nextUrl.pathname);
      return !!token;
    },
  },
});

export const config = {
  matcher: ["/chats/:path*", "/contacts/:path*", "/profile/:path*"],
};
