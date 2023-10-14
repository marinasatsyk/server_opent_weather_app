"use strict"
import axios from 'axios';
/**
 * Module dependecies
 */
import verifyJWT from '../middlewares/verifyJWT.js';
import * as  users from '../controllers/users.js';
import * as weather from '../controllers/weather.js';
import { dateToTimestamp } from '../utils/index.js';
import * as refreshTokenController from '../controllers/refreshToken.js';


const  routes =  (app) =>  {
    //auth
    app.post('/checkToken', verifyJWT, users.auth);
    app.post('/refreshToken', refreshTokenController.refreshToken );//witjout withAuth cause it IS token

    //users routes
    app.post("/user/login", users.login);
    app.post("/user/signup", users.signUp);
    app.get('/user/all', verifyJWT, users.list);
    app.get('/user/:id', verifyJWT,   users.home);
    app.put('/user/:id', verifyJWT,   users.home);
    
    //weather

    /**
     * Dashboard
     */


    app.get('/user/city/historyweather', weather.historyWeather);
}

export default routes;




