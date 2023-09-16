/* eslint-disable no-param-reassign */
import jwt from 'jsonwebtoken'
import NextAuth from "next-auth"
import GoogleProvider from "next-auth/providers/google"


import db from "@/utils/dbConnect"
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
  session:{
    strategy:'jwt',
    maxAge:24*60*60,
    updateAge:60*60*4
  },
  callbacks: {
    async signIn(user){
      
      try{
        const {id, name} = user.user
        const userData = await db.query`SELECT 1 FROM users WHERE user_id = ${id}`
        
        if(userData.recordset.length === 0){
            await db.query`INSERT INTO users (user_id, attempts, success_rate, user_name) VALUES (${id}, 0, 0, ${name})`
        }
      }catch(error){
          console.log(error)
          return false
      }
      return true
    },
    async session({ session, token}) {
      // Send properties to the client, like an access_token from a provider.
      session.token = jwt.sign(token, process.env.AUTH_SECRET)
      return session
    },
    
  }
}

export default NextAuth(authOptions)