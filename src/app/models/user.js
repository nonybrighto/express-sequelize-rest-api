'use strict';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

import {validEmail} from '../helpers/validators';
import config from './../../config/config';


module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    username: DataTypes.STRING,
    email: DataTypes.STRING,
    profilePhoto: DataTypes.STRING,
    password: DataTypes.STRING
  }, {
    defaultScope: {
      attributes: { exclude: ['password', 'email'] },
    },
    scopes: {
      withHidden: {
          attributes: { },
      }
    }  
  });
  User.associate = function(models) {
    // associations can be defined here
  };

  User.beforeCreate(async (user, options) => {
    let passwordHash = await bcrypt.hash(user.password, 10);
    user.password = passwordHash;
  });

  User.prototype.changePassword = async function(newPassword){

    this.password =  await bcrypt.hash(newPassword, 10);;
    let user = await this.save();
    if(user){
        return true;
    }
    return false;

}

  User.prototype.toJSON =  function () {
    var values = Object.assign({}, this.get());
  
    delete values.password;
    return values;
  }

  User.prototype.generateJwtToken = function(){

    let expireDays = config.get('jwt_token-expire-days');

    return jwt.sign(
        {id:this.id, username: this.username, email: this.email},
        config.get('jwt-secret'),
        {expiresIn: expireDays+' days'}
    );
}

  User.prototype.toAuthJSON = function (){

    let expireDays = config.get('jwt_token-expire-days');
    let expirationDate = new Date();
    expirationDate.setDate(new Date().getDate() + expireDays);

    return {token: this.generateJwtToken(), tokenExpires: expirationDate, user: {id: this.id, username: this.username, email: this.email}};
  }

  User.canLogin = async function(credential, password){

    let userDataToFind = {};
    if(validEmail(credential)){
        userDataToFind['email'] = credential;
    }else{
        userDataToFind['username'] = credential;
    }
   
    let user = await this.scope('withHidden').findOne({where: userDataToFind});
    if(user){
        let passwordMatch = await bcrypt.compare(password, user.password);
            if (passwordMatch) {
                return user;
            } else {
                return false;
            }
    }
    return false;
}

User.findOrCreateSocialUser = async function({email, name, profilePhoto}){

  let user = await this.findOne({where:{email: email}});
  if(user){
      return user;
  }else{
      let username = name.split(' ')[0].trim();
      while(await this.findOne({where:{username: username}})){
          let randomNumbers = Math.floor(Math.random() * 200);
          username = username+randomNumbers;
      }

      let  randomPasswordString  = Math.random().toString(36).slice(-8);
      let userRegistered = await this.create({username: username, email:email, password:randomPasswordString, profilePhoto: profilePhoto});

      return userRegistered;
  }

}

  return User;
};