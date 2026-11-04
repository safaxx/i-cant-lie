import CredentialsProvider from "next-auth/providers/credentials";
import { NextAuthOptions } from "next-auth";
import bcrypt from "bcryptjs";
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      id: "credentials-login",
      // The name to display on the sign in form (e.g. "Sign in with...")
      name: "Credentials",
      // `credentials` is used to generate a form on the sign in page.
      // You can specify which fields should be submitted, by adding keys to the `credentials` object.
      // e.g. domain, username, password, 2FA token, etc.
      // You can pass any HTML attribute to the <input> tag through the object.
      credentials: {
        identifier: {
          label: "Email or username",
          type: "text",
          placeholder: "Email or username",
        },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials: any): Promise<any> {
        // Add logic here to look up the user from the credentials supplied
        await dbConnect();

        try {
          const user = await UserModel.findOne({
            $or: [
              { email: credentials.identifier },
              { username: credentials.identifier },
            ],
          });

          if (!user) {
            // If you return null then an error will be displayed advising the user to check their details.
            //return null;
            // You can also Reject this callback with an Error thus the user will be sent to the
            // error page with the error message as a query parameter
            throw new Error("No user found with this email/username");
          }
          if (!user.isVerified) {
            throw new Error("Please verify your account before login");
          }

          //NOW, Any object returned will be saved in `user` property of the JWT
          const isPswrdCorrect = await bcrypt.compare(
            credentials.password,
            user.password,
          );
          if (isPswrdCorrect) {
            return user;
          } else {
            throw new Error("Incorrect Credentials");
          }
        } catch (error: any) {
          throw new Error(error);
        }
      },
    }),
    //add OAuth - google provider here
  ],
  callbacks: {
    async session({ session, token }) {
        if(token){
            session.user._id = token._id;
            session.user.isAcceptingMessages = token.isAcceptingMessages;
            session.user.isVerified = token.isVerified;
            session.user.username = token.username;
        }
      return session
    },
    async jwt({ token, user }) {
        if(user){
            token._id = user._id?.toString();
            token.isVerified = user.isVerified;
            token.isAcceptingMessages = user.isAcceptingMessages;
            token.username = user.username;
        }
      return token
    }
  },
  pages: {
    signIn: '/signin',
  },
  session:{
    strategy: "jwt",
    maxAge: 24 * 60 * 60,
  },
  jwt: {
    maxAge: 24 * 60 * 60,
  },
  secret: process.env.NEXTAUTH_SECRET
};
