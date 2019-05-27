import models from '../../src/app/models'

async function clearMockDB(){

   await models.sequelize.sync({force: true});

   await Promise.all([
    models.User.destroy({ truncate: true }),
    models.JwtTokenBlacklist.destroy({ truncate: true })
   ]);
}


export {clearMockDB}