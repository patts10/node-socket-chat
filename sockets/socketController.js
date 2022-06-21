const { Socket } = require("socket.io");
const { verifyJWT } = require("../helpers");
const { ChatMessages } = require("../models");

const chatMessages = new ChatMessages();

const socketController = async( socket = new Socket(), io ) => {

  const token = socket.handshake.headers['x-token'];  
  const user = await verifyJWT(token);

  if ( !user ) {
    return socket.disconnect();
  }

  chatMessages.connectUser(user);
  io.emit('active-users', chatMessages.usersArray);

}

module.exports = {
  socketController
}