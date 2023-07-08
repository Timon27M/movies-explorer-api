require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const { errors } = require('celebrate');
const cors = require('./middlewares/cors');
const handlerError = require('./middlewares/handlerError');
const routes = require('./routes/index');

const { requestLogger, errorLogger } = require('./middlewares/logger');

const { PORT = 3000, DBlink = 'mongodb://127.0.0.1:27017/bitfilmsdb' } = process.env;

const app = express();

app.use(bodyParser.json());
app.use(cors());

app.use((req, res, next) => {
  req.user = {
    _id: '64a5939d55131cf774f2a2c6', // вставьте сюда _id созданного в предыдущем пункте пользователя
  };

  next();
});

app.use(requestLogger);
app.use('/', routes);
app.use(errorLogger);

app.use(errors());
app.use(handlerError);

mongoose.connect(DBlink);

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
