const mongoose = require('mongoose');

const dbConnection = async() => {

  try {

    await mongoose.connect( process.env.MONGODB_CNN, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    console.log('MongoDB connected');
    
  } catch (error) {
    console.log(error);
    throw new Error(' when starting connection to database');
  }

}

module.exports = {
  dbConnection
}