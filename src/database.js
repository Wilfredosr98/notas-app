const mongoose = require('mongoose');

(async () => {
  try {
    const db = await mongoose.connect('mongodb+srv://wilfre:26000371Ucv$@cluster0.1ikrz.mongodb.net/Cluster0?retryWrites=true&w=majority', 
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useFindAndModify: false,
      useCreateIndex: true,
    });
    console.log("Mongodb is connected to", db.connection.host);
  } catch (error) {
    console.error(error);
  }
})();
