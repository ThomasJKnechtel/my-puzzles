/* eslint-disable no-param-reassign */
import jwt from 'jsonwebtoken'
import NextAuth from "next-auth"
import GoogleProvider from "next-auth/providers/google"

import getUser from '../db/getUser'


export const authOptions = {
  secret: process.env.AUTH_SECRET,
  // Configure one or more authentication providers
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
    // ...add more providers here
  ],
  pages:{
    signIn:"/login",
    newUser:"/signup"
  },
  session:{
    strategy:'jwt',
    maxAge:24*60*60,
    updateAge:60*60*4
  },
  callbacks: {
    async jwt({token}){
      const record = await getUser(token.sub)
      if(record){
         token.username = record.user_name
      }             
      return token
    },
    async session({ session, token}) {
      session.username = token.username
      session.token = jwt.sign(token, process.env.AUTH_SECRET)
      return session
    },
    
  }
}

export default NextAuth(authOptions)