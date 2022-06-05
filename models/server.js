const express = require('express');
const cors = require('cors');
const fileUpload = require('express-fileUpload');

const { dbConnection } = require('../database/config.js');
const { socketController } = require('../sockets/socketController.js');

class Server {
  
  constructor(){
    this.app = express();
    this.port = process.env.PORT;
    this.server = require('http').createServer(this.app);
    this.io = require('socket.io')(this.server);

    this.paths = {
      auth : '/api/auth',
      categories : '/api/categories',
      products : '/api/products',
      search : '/api/search',
      uploads : '/api/uploads',
      users : '/api/users'
    }

    //Connect to database
    this.connectDB();


    //Middlewares
    this.middlewares();
    
    //Routes
    this.routes();

    //Sockets
    this.sockets();
  }

  async connectDB() {
    await dbConnection();
  }
  
  middlewares() {
    //?Cors
    this.app.use(cors());

    //?Read and pase of body
    this.app.use( express.json() )
    
    //?Public directory
    this.app.use( express.static('public'));

    //?load files
    this.app.use(fileUpload({
      useTempFiles : true,
      tempFileDir : '/tmp/',
      createParentPath: true
  }));
  }

  routes() {

    this.app.use(this.paths.auth, require('../routes/auth'));
    this.app.use(this.paths.categories, require('../routes/categories'));
    this.app.use(this.paths.products, require('../routes/products.js'));
    this.app.use(this.paths.search, require('../routes/search.js'));
    this.app.use(this.paths.uploads, require('../routes/uploads'));
    this.app.use(this.paths.users, require('../routes/users'));
  }

  sockets() {
    this.io.on('connection', socketController );
  }

  listen() {
    this.server.listen( this.port, () => {
      console.log('Server is running at port: ', this.port );
    } );
  }

}


module.exports = Server;