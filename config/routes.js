"use strict"
import axios from 'axios';
/**
 * Module dependecies
 */
import withAuth from '../withAuth.js';
import * as  users from '../controllers/users.js';
import * as weather from '../controllers/weather.js';
import { dateToTimestamp } from '../utils/index.js';


const  routes =  (app) =>  {
    //auth
    app.get('/checkToken', withAuth, users.auth);

    //users routes
    app.post("/user/login", users.login);
    app.post("/user/add", users.newUser);
    app.get('/user/all', users.list);
    app.get('/user/:id', users.home);
    
    //weather

    app.get('/user/city/historyweather', weather.historyWeather);
}

export default routes;




