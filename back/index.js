require('dotenv').config();
const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const router = require('./router/index');
const ApiError = require('./exceptions/api-error');
const errorMiddleware = require('./middlewares/error-middleware');
const path = require('path');

const PORT = process.env.PORT || 5000;
const app = express();
const filesDir = path.join(__dirname, '../files');

app.use('/assets', express.static(filesDir));
app.use(express.json());
app.use(
  cors({
    credentials: true,
    origin: process.env.CLIENT_URL,
  }),
);
app.use(cookieParser());
app.use('/api', router);
app.use(errorMiddleware);

const start = async () => {
  try {
    app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
  } catch (e) {
    console.log(e);
  }
};

start();
