import { Connect } from "@/db/DbConnection";
import User from "@/models/user";
import { compare } from "bcryptjs";
import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

interface Credentials {
  email: string;
  password: string;
}
const handler = NextAuth({
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: {
          label: "Email",
          type: "text",
          placeholder: "Enter your email",
        },
        password: {
          label: "Password",
          type: "password",
          placeholder: "Enter your password",
        },
      },
      async authorize(
        credentials: Record<string, string> | undefined
      ): Promise<any | null> {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Please enter your email and password");
        }
        await Connect();
        const user: any = await User.findOne({ email: credentials.email });

        if (!user || !user?.password) {
          throw new Error("Invalid email or password");
        }

        const isMatch: boolean = await compare(
          credentials.password,
          user.password
        );

        if (!isMatch) {
          throw new Error("Invalid password");
        }
        return user;
      },
    }),
  ],

  callbacks: {
    async session({ session }: any): Promise<any> {
      const mongoDBUser: any = await User.findOne({
        email: session.user?.email,
      });
      session.user.id = mongoDBUser._id.toString();
      session.user = { ...session.user, ...mongoDBUser._doc };
      return session;
    },
  },
});

export { handler as GET, handler as POST };
