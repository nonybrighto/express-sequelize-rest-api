import passport from 'passport';
import RateLimit from 'express-rate-limit';
import createError from 'http-errors';
import httpStatus from 'http-status';
import models from '../models/';

const JwtTokenBlacklist  = models.JwtTokenBlacklist;

const loginLimiter = new RateLimit({
    windowMs: 2 * 60 * 1000,
    max: 15,
    message:"Too many login attempts, please try again after 5 minutes",
    skipSuccessfulRequests:true
  });


function jwtRequiredAuthentication(req, res, next){

  passport.authenticate('jwt', {session: false}, async (err, user, info) => {

    //This token is used to make sure the user is not making use of a token that has been logged out or changed
    //remove if not necessary
   try{
      let userJwtToken = req.headers.authorization.split(' ')[1];
      if (err || !user || await JwtTokenBlacklist.findOne({where:{token:userJwtToken }})) {
         return next(createError(httpStatus.UNAUTHORIZED, 'Request not authorized'));
      }else{
          req.user = user;
      }
   }catch(error){
      return next(createError('unknown error occured Contact admin'));
   }
    next();
})(req, res, next);

}

function jwtOptionalAuthentication(req, res, next){
    
    //This token is used to make sure the user is not making use of a token that has been logged out or changed
    //remove if not necessary
  let userJwtToken = req.headers.authorization.split(' ')[1];
  passport.authenticate('jwt', {session: false}, async (err, user, info) => {
    if(user && !(await JwtTokenBlacklist.findOne({where:{token:userJwtToken }}))){
      req.user = user;
    }
  next();
  })(req, res, next);
  
}

export {loginLimiter, jwtRequiredAuthentication, jwtOptionalAuthentication}