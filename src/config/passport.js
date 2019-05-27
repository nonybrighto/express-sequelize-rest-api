import passport from 'passport';
import passportJwt from 'passport-jwt';
import passportLocal from 'passport-local';
import FacebookTokenStrategy from 'passport-facebook-token';
import GoogleTokenStrategy from 'passport-google-id-token';
import models from '../app/models/';
import config from './config';

const User = models.User;

function configurePassport(){

    passport.use(new passportLocal.Strategy({
        usernameField: 'credential',
        passwordField: 'password'
    },
    async function (credential, password, done) {

        try{
            // @ts-ignore
            let user = await User.canLogin(credential, password);
            if(user){
                return done(null, user);
            }else{
                return done(null, false, { message: 'Invalid login or password' });
            }
            return done(null, false, { message: 'Invalid login or password' });
        }catch(error){
            console.log(error);
            return done(error);
        }

    }
));

    
    passport.use(new passportJwt.Strategy({
        jwtFromRequest: passportJwt.ExtractJwt.fromAuthHeaderWithScheme('bearer') ,
        secretOrKey   : config.get('jwt-secret')
    },
    async function (jwtPayload, done) {

        try{
            const user = await User.scope('withHidden').findByPk(jwtPayload.id);
            if(user){
                return done(null, user);
            }else{
                return done(new Error('Could not get user credentials'), false);
            }
        }catch(error){
            return done(error, false);
        }
    }
));

    //NOTE: These social login implementation authenticates the user once the email matches an
    //existing email in the system. Might not be what you need if this is a serious security concern to you.
    passport.use(new GoogleTokenStrategy({
        clientID: config.get('google-client-id')
    },
    async function(parsedToken, googleId, done) {

        const userPayload = parsedToken.payload;

        try{
            // @ts-ignore
            const user = await User.findOrCreateSocialUser({ username: userPayload.username, email: userPayload.email, profilePhoto: userPayload.picture});
            return done(null, user);
        }catch(error){
            done(error, false);
        }
    }
    ));

passport.use(new FacebookTokenStrategy({
    clientID: config.get('facebook-client-id'),
    clientSecret: config.get('facebook-client-secret')
  }, async function(accessToken, refreshToken, profile, done) {

    try{
        // @ts-ignore
        const user = await User.findOrCreateSocialUser({ username: profile.displayName, email: profile.emails[0].value, profilePhoto: profile.photos[0].value});
        return done(null, user);
    }catch(error){
        done(error, false);
    }
  }
));

}

export default configurePassport;

