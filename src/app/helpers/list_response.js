import createError from 'http-errors';
import httpStatus from 'http-status';
import Pagination from './pagination';


function listResponse({itemCount, errorMessage, getItems}){

   return async function(req, res, next){
        try{
            let page = req.query.page;
            let limit = req.query.limit;
            let pagination = new Pagination(itemCount, page, limit);
            let gottenItems = await getItems(pagination.getOffset(), limit);
            return res.status(httpStatus.OK).send({...pagination.generatePaginationObject(), results: gottenItems});
        }catch(error){
            return next(createError(errorMessage || 'Internal error occured while getting items'));
        }
   }
}

export default listResponse;