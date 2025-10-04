import NextAuth from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import {User} from '@/app/models/User';
import mongoose from "mongoose";
import bcrypt from "bcrypt";



const handler = NextAuth({
  secret: process.env.SECRET,
  providers:[
        CredentialsProvider({
        name: 'Credentials',
        id: 'Credentials',
        credentials: {
        email: { label: "Email", type: "email", placeholder: "test@example.com" },
        password: { label: "Password", type: "password" }
        },
        async authorize(credentials, req) {
          const email = credentials?.email;
          const password = credentials?.password;

          mongoose.connect(process.env.MONGO_UR!);
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