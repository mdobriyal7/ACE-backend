const dotnev = require("dotenv")
const express = require("express");
const mongoose = require("mongoose");
mongoose.set('strictQuery', false);

const app = express();

dotnev.config({ path: './config.env' });

require('./db/conn');

app.use(express.json());
app.use('/product', require('./router/product-routes'));
const port = process.env.PORT;



app.listen(port, () => {
  console.log("server is running");
});
