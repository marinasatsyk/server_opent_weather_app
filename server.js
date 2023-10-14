/**express*/
import express from 'express';
import dotenv from "dotenv";
/**json parser*/
import bodyParser from 'body-parser';
/**variable of environnement*/
 import "dotenv/config.js";

/**cors restrictions*/
import cors from 'cors';
/**mongo db*/
import MongoDBClient from './database.js';

/**routes */
import routes from "./config/routes.js";

/**socket io*/
import http from 'http';
import { Server } from "socket.io";
import cookieParser from 'cookie-parser';
import { logger } from './src/logger/index.js';


const app = express();
dotenv.config();

app.use(cors());

/**socket io*/
const server = http.createServer(app);
const io = new Server(server);


/**parse application/json
 * app.use called for all routes
 *  middelware
*/
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json());

//middleware for cookie
app.use(cookieParser());

/**implementation socket io server side*/
io.on('connection', (socket) => {
  console.log('a user connected', socket.id);

  
  
  socket.on('disconnect', () => {
    console.log('user disconnected'+  socket.id);
  });

});

/**routes must be outside of io.on  */
  routes(app);
  // authRoutes(app);
  // messageRoutes(app, io);
  // notificationRoutes(app, io)

/**start server WITH socket , so server.listen and not app.listen*/
app.use((err, req, res, next) => {
  logger.error(err.stack);
  res.status(err.statusCode || 500)
  .send({error: err.message})
})

server.listen(process.env.SERVER_PORT, () => {
  console.log(`SERVER ready on : http://${process.env.SERVER_HOST}:${process.env.SERVER_PORT}`);
  
  /**mongo db*/
  try{
    MongoDBClient.initialize()
  }
  catch(err){
    console.error('db doesn\'t connect', err);
  }
})