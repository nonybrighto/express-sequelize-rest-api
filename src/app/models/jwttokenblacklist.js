'use strict';
module.exports = (sequelize, DataTypes) => {
  const JwtTokenBlacklist = sequelize.define('JwtTokenBlacklist', {
    token: DataTypes.STRING
  }, {});
  JwtTokenBlacklist.associate = function(models) {
    // associations can be defined here
  };
  return JwtTokenBlacklist;
};