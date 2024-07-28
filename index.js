const express = require('express');
const { connectToMongoDB } = require('./connect');
const URL = require("./models/url");
const path = require("path");
const cookieParser = require("cookie-parser");
const { checkForAuthentication, restrictTo } = require("./middlewares/auth");

const urlRoute = require('./routes/url');
const staticRoute = require('./routes/staticRouter');
const userRouter = require("./routes/user");

const app = express();
const PORT = 8001;

connectToMongoDB('mongodb://localhost:27017/short-url').then(() => {
  console.log('mongoDB connected');
}).catch(err => {
  console.error('MongoDB connection error:', err);
});

app.set('view engine', 'ejs');
app.set('views', path.resolve('./views'));

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(checkForAuthentication);

app.use('/url', restrictTo(["NORMAL", "ADMIN"]), urlRoute);
app.use('/user', userRouter);
app.use("/", staticRoute);

app.listen(PORT, () => {
  console.log(`Server is running at port ${PORT}`);
});
