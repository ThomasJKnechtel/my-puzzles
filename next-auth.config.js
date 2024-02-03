/* eslint-disable import/no-anonymous-default-export /
export default {
    providers: [
      {
        id: 'google',
        name: 'Google',
        type: 'oauth',
        version: '2.0',
        scope: 'openid profile email',
        params: { grant_type: 'authorization_code' },
        accessTokenUrl: 'https://accounts.google.com/o/oauth2/token',
        requestTokenUrl: 'https://accounts.google.com/o/oauth2/auth',
        authorizationUrl: 'https://accounts.google.com/o/oauth2/auth',
        profileUrl: 'https://www.googleapis.com/oauth2/v1/userinfo?alt=json',
        profile: (profile) => ({
            id: profile.id,
            name: profile.name,
            email: profile.email,
            image: profile.picture,
          }),
        clientId: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbacks: {
          async signIn(user, account, profile) {
            // Optionally, customize the signIn callback logic
            return true;
          }
        },
      },
    ],
  };
  
