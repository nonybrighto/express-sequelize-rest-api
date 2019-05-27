import httpStatus from 'http-status';
import createError from 'http-errors';
import models from '../models';
import listResponse from '../helpers/list_response';


const User = models.User;

async function list(req, res, next){
       
    try{        
        await listResponse({
            itemCount: await User.count(),
            getItems: async (skip, limit) => await  User.findAll({ offset: skip, limit: limit }),
            errorMessage: 'Error occured while getting users'
        })(req, res, next);
    }catch(error){
        next(createError('Error occured while getting users'));
    }  
}

async function changePassword(req, res, next){

    try{
        let oldPassword = req.body.oldPassword;
        let newPassword = req.body.newPassword;

        // @ts-ignore
        let user = await User.canLogin(req.user.username, oldPassword);
        if(user){
                // @ts-ignore
               let changed = await user.changePassword(newPassword);
               if(changed){
                    res.sendStatus(200);
               }else{
                    throw new Error('Could not change password');
               }
        }else{
            next(createError(httpStatus.FORBIDDEN, 'not permitted to change password'));
        }
    }catch(error){
        console.log(error);
        next(createError('Error occured while changing password'));
    }

}

export default {list, changePassword};



