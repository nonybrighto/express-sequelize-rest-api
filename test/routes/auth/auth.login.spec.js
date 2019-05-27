import chai from 'chai';
import chaiHttp from 'chai-http';
import httpStatus from 'http-status';
import app from '../../../src/app';
import {clearMockDB} from '../../config/mock_db_config';

chai.use(chaiHttp);

const expect = chai.expect;


describe('auth/', function(){

    let validUserCredentials = {username:'Mark', email:'mark@gmail.com', password:'password@1'};

    before(async function(){
           return clearMockDB();
    });

    describe('REGISTER', function(){


        it('Should successfully register new user and return a token with user details', async function(){

            let response = await chai.request(app)
            .post('/api/v1/auth/register')
            .set('Content-Type','application/json')
            .send(validUserCredentials);

            expect(response).to.have.status(httpStatus.CREATED);
            expect(response.body.token).to.not.be.null;
            expect(response.body.user.username).to.equal(validUserCredentials.username);

        });

        it('should fail if email exists ', async function(){
          let response = await chai.request(app)
          .post('/api/v1/auth/register')
          .set('Content-Type','application/json')
          .send({username:'John', email: validUserCredentials.email, password: 'MyPassword'});

          expect(response).to.have.status(httpStatus.CONFLICT);
               
        });

        it('should fail if username exists', async function(){

          let response = await chai.request(app)
          .post('/api/v1/auth/register')
          .set('Content-Type','application/json')
          .send({username: validUserCredentials.username, email: 'new@gmail.com', password: 'MyPassword'});

          expect(response).to.have.status(httpStatus.CONFLICT);

        });

    });

    describe('LOGIN', function(){

          it('Should fail if login details are not valid', async function(){

            let response = await chai.request(app)
            .post('/api/v1/auth/login')
            .set('Content-Type','application/json')
            .send({credential: 'wronguser', password: 'MyPassword'});

            expect(response).to.have.status(httpStatus.BAD_REQUEST);

          });

          it('Should succeed if login details are valid - username', async function(){
            let response = await chai.request(app)
            .post('/api/v1/auth/login')
            .set('Content-Type','application/json')
            .send({credential: validUserCredentials.username, password: validUserCredentials.password});

            expect(response).to.have.status(httpStatus.OK);

          });
          it('Should succeed if login details are valid - email', async function(){

            let response = await chai.request(app)
            .post('/api/v1/auth/login')
            .set('Content-Type','application/json')
            .send({credential: validUserCredentials.email, password: validUserCredentials.password});

            expect(response).to.have.status(httpStatus.OK);
          });
    });

});