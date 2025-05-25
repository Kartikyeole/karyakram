import NextAuth, { CredentialsSignin } from "next-auth"
import Credentials from "next-auth/providers/credentials"
import dbConnect from "@/lib/db";
import User from "@/models/userModel";

import { compare } from "bcryptjs";

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Credentials({
      credentials: {
        email: {
          type: "email",
          label: "Email",
          placeholder: "johndoe@gmail.com",
        },
        password: {
          type: "password",
          label: "Password",
          placeholder: "*****",
        },
      },

    authorize: async (credentials, req) => {

      const { email, password } = credentials as {
        email: string;
        password: string;
      };

      if (!email || !password) {
        throw new CredentialsSignin("Please enter email and password");
      }

      await dbConnect();

      const user = await User.findOne({ email });

      if (!user) {
        throw new CredentialsSignin("No user found with this email");
      }

      const isValidPassword = await compare(password, user.password);

      if (!isValidPassword) {
        throw new CredentialsSignin("Invalid password");
      }
      return {
        id: user.id,
        name: user.name,
        email: user.email,
      };
    }})
  ],
pages: {
  signIn: "/login",
  },
})