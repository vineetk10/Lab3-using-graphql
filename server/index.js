require("dotenv").config();
// var mysql = require('mysql');
// require("dotenv").config();
const mongoose = require("mongoose");
const express = require("express");
const app = express();
const cookieParser = require("cookie-parser");
const cors = require("cors");
var bodyParser = require('body-parser');

const userRoutes = require("./Routes/userRoutes");
const authRoutes = require("./Routes/authRoutes");
const shopRoutes = require("./Routes/shopRoutes");
const itemRoutes = require("./Routes/itemRoutes");
const orderRoutes = require("./Routes/orderRoutes");
const { getFileStream } = require("./s3");
mongoose.connect('mongodb://127.0.0.1:27017/Etsy', {
  useNewUrlParser: true
}).then(() => {
  console.log("DB CONNECTED");
}).catch((error)=>console.log("DB CONNECTED FAILED"+error))

const port = process.env.PORT || 8001;

app.listen(port, () => {
  console.log(`app is running at ${port}`);
})

app.use(express.json());
app.use(cookieParser());
app.use(cors({ origin: true, credentials: true}));
app.use(bodyParser.json({limit:'500mb'})); 
app.use(bodyParser.urlencoded({extended:true})); 
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "http://localhost:3000"); // update to match the domain you will make the request from
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});
app.get('/api/images/:key',(req,res)=>{
  const key = req.params.key
  const readStream = getFileStream(key)
  readStream.pipe(res);
})
app.use("/api", authRoutes);
app.use("/api", userRoutes);
app.use("/api", shopRoutes);
app.use("/api" ,itemRoutes);
app.use("/api", orderRoutes);
module.exports = app;