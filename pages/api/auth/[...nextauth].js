import db from "@/utils/dbConnect"
import NextAuth from "next-auth"
import GoogleProvider from "next-auth/providers/google"
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
  callbacks: {
    async signIn(user, account, profile){
      
      try{
        const {id, name} = user.user
        const userData = await db.query`SELECT 1 FROM users WHERE user_id = ${id}`
        
        if(userData.recordset.length == 0){
            await db.query`INSERT INTO users (user_id, attempts, success_rate, user_name) VALUES (${id}, 0, 0, ${name})`
        }
      }catch(error){
          console.log(error)
          return false
      }
      return true
    
      
    }
  }
}

export default NextAuth(authOptions)