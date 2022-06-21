class message {
    constructor( uid, name, message ) {
        this.uid = uid;
        this.name = name;
        this.message = message;
    }
}

class ChatMessages {
  constructor() {
    this.messages = [];
    this.users = {};
  }

  get last10() {
    this.messages = this.messages.splice(0, 10);
    return this.messages;
  }

  get usersArray() {
    return Object.values(this.users);
  }

  sendMessage( uid, name, message ) {
    this.messages.shift(
      new message( uid, name, message )
    );
  }

  connectUser( user ) {
    this.users[user.uid] = user;
  }

  disconnectUser( uid ) {
    delete this.users[uid];
  }
}

module.exports = ChatMessages;