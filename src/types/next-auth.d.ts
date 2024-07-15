import "next-auth";
import { DefaultSession } from "next-auth";

// types ko redefine kar sekte he ya define bhi
// ninja technique

//masle ka hal
declare module "next-auth" {
  interface User {
    _id?: string;
    username?: string;
    isVerified?: boolean;
    isAcceptingMessage?: boolean;
  }
  interface Session {
    user: {
      _id?: string;
      username?: string;
      isVerified?: boolean;
      isAcceptingMessage?: boolean;
    } & DefaultSession["user"];
  }
}

//another way of redeclaring

declare module "next-auth/jwt" {
  interface JWT {
    _id?: string;
    username?: string;
    isVerified?: boolean;
    isAcceptingMessage?: boolean;
  }
}
