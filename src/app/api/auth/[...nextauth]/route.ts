import NextAuth from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import {User} from '@/app/models/User';
import mongoose from "mongoose";
import bcrypt from "bcrypt";
import GoogleProvider from "next-auth/providers/google";


const handler = NextAuth({
  secret: process.env.SECRET,
  providers:[
        GoogleProvider({
        clientId: process.env.GOOGLE_CLIENT_ID!,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET!
        }),
        CredentialsProvider({
        name: 'Credentials',
        id: 'credentials',
        credentials: {
        email: { label: "Email", type: "email", placeholder: "test@example.com" },
        password: { label: "Password", type: "password" }
        },
        async authorize(credentials, req) {
          const email = credentials?.email;
          const password = credentials?.password as string;

          mongoose.connect(process.env.MONGO_URL!);
          const user = await User.findOne({email});
          const password0k = user && bcrypt.compareSync(password, user.password);

          if(password0k) {
            return user;
          }
        return null
        }
    })
  ],
});

export { handler as GET, handler as POST }