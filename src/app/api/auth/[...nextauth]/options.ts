// auth/[...nextauth] ke andar 2 file banani he
// sign in ke liye
//bahut important he
import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import UserModel from "@/model/User.model";
import dbConnect from "@/lib/dbConnect";

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      id: "credentials",
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
        // iski help se nextauth ui generate kardega
      },

      async authorize(credentials: any): Promise<any> {
        await dbConnect();
        try {
          const user = await UserModel.findOne({
            $or: [
              //dono me se kisi bhi 1 se search kar rahe
              { email: credentials.identifier },
              { username: credentials.identifier },
            ],
          });

          //iski wajah se credentials ka upyog kar rahe he , custom field
          if (!user) {
            throw new Error("No user found having this email");
          }
          if (!user.isVerified) {
            throw new Error("User is not verified, please verify!");
          }

          const isCorrectPassword = await bcrypt.compare(
            credentials.password,
            user.password
          );

          if (!isCorrectPassword) {
            throw new Error("Invalid Password!");
          }

          return user;
        } catch (error) {}
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      // user se data lekar token ko aur powerful bana rahe he
      if (user) {
        token._id = user._id?.toString();
        token.username = user.username;
        token.isVerified = user.isVerified;
        token.isAcceptingMessages = user.isAcceptingMessages;
        // idhar masla ho raha tha to types me jakar naye next-auth ke type define kare
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user._id = token._id;
        session.user.isVerified = token.isVerified;
        session.user.isAcceptingMessages = token.isAcceptingMessages;
        session.user.username = token.username;
      }
      return session;
    },
    //iska fayda ye hua ki hume baar baar db ko call nahin karni padegi
  },
  pages: {
    //nextauth saare route khud banadega
    signIn: "/sign-in",
  },
  session: {
    strategy: "jwt",
  },
  secret: process.env.NEXTAUTH_SECRET,
};
