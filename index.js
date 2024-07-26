const express = require('express');
const { connectToMongoDB } = require('./connect');
const URL = require("./models/url");
const path = require("path");
const cookieParser = require("cookie-parser");
const {restrictToLoggedinUserOnly, checkAuth} = require("./middlewares/auth")
const urlRoute = require('./routes/url');
const staticRoute = require('./routes/staticRouter');
const userRouter = require("./routes/user")

const app = express();
const PORT = 8001;

connectToMongoDB('mongodb://localhost:27017/short-url').then(() => {
  console.log('mongoDB connected');
});

// Set the view engine to EJS
app.set('view engine', 'ejs');
app.set('views', path.resolve('./views'));

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.use('/url', restrictToLoggedinUserOnly,urlRoute);
app.use('/user', userRouter);
app.use('/',checkAuth, staticRoute);

app.listen(PORT, () => {
  console.log(`Server is running at port ${PORT}`);
});
