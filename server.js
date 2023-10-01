/**express*/
import express from 'express';
const app = express();

const PORT = 18500;

/**json parser*/
import bodyParser from 'body-parser';

/**variable of environnement*/
import "dotenv/config.js";
// dotenv.config();

/**cors restrictions*/
import cors from 'cors';
app.use(cors());

/**mongo db*/
import MongoDBClient from './database.js';

/**routes */
import routes from "./config/routes.js";

/**socket io*/
import http from 'http';
const server = http.createServer(app);
import { Server } from "socket.io";
const io = new Server(server);


/**parse application/json
 * app.use called for all routes
 *  middelware
*/
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json());


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
server.listen(PORT, () => {
  console.log('Connecté au port' + PORT)
  /**mongo db*/try{
    MongoDBClient.initialize()
  }
  catch(err){
    console.error('db doesn\'t connect', err);
  }
})