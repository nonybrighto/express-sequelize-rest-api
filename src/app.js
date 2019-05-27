import createHttpError from 'http-errors';
import express from 'express';
import path from 'path';
import logger from 'morgan';
import bodyParser from 'body-parser';
import helmet from 'helmet';
import passport from 'passport';
import httpStatus from 'http-status';
import config from './config/config';
import expressValidation from 'express-validation';
import cors from 'cors';
import RateLimit from 'express-rate-limit';
import router from './app/routes/index.route';
import configurePassport from './config/passport';

const app = express();
app.use(helmet());
app.use(bodyParser.json()); 
app.use(bodyParser.urlencoded({ extended: false })); 
app.use(logger('dev'));
app.use(helmet());
app.use(cors());

app.use(passport.initialize());
configurePassport();

const apiLimiter =  new RateLimit({
  windowMs: 5 * 60 * 1000,
	max: 100,
	message: 'Too many requests. Please try again later.'
}); 

app.use(apiLimiter);
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use('/public', express.static('public'));

//api route
app.use('/api/v1', router);

expressValidation.options({
  status: 422,
  statusText: 'Unprocessable Entity'
});

 // catch 404 and forward to error handler
 app.use((req, res, next) => {
	return next(createHttpError(httpStatus.NOT_FOUND, 'API URI not found'));
  });

app.use((err, req, res, next) => {
		if (err instanceof expressValidation.ValidationError) {
			// validation error contains errors which is an array of error each containing message[]
			//const unifiedErrorMessage = err.errors.map(error => error.messages.join('. ')).join(' and ');
			//message = 'Validation failed';
			return next(createHttpError(err.status, err));
		}
		return next(err);
  });
  
 

  app.use((err, req, res, next) => {

		let responseBody = {};
		responseBody.message = err.isPublic ? err.message : httpStatus[err.status];
		if(config.get('NODE_ENV') === 'development'){
			responseBody.stack = err.stack;
		}
		// if(err.errors){
		// 	responseBody.errors = err.errors;
		// }
		return res.status(err.status).json(responseBody);
	}
  );

export default app;
