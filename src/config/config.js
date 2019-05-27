'use strict';

import nconf from 'nconf';

nconf.argv().env();

const environment = nconf.get('NODE_ENV') || 'development';

console.log(environment);
//used to get test sspecific configurations - file will not be read during production.
if(environment == 'test'){
	nconf.file(__dirname+'/test.json');
}

nconf.defaults({
	'api-v1-url': 'http://localhost:3000/api/v1/',
	'NODE_ENV': 'development',
	'base-url': 'http://localhost:3000/',
	'jwt-secret': '0a6b357d-d2fb-666d-a84e-0295a986cd9f',
	'uuid-namespace': '1b512364-41d5-456e-54b0-cda1fe1f3341',
	'facebook-client-id':'1234546555',
	'facebook-client-secret':'323446674',
    'google-client-id':'355677712233',
	'jwt_token-expire-days':30
});

export default nconf;