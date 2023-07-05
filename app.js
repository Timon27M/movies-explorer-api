const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const { errors } = require('celebrate');
const NotFoundError = require('./errors/NotFoundError');
const { createUser } = require('./controllers/users');
const handlerError = require('./middlewares/handlerError');

const routesUser = require('./routes/users');
const routesMovie = require('./routes/movies');

const { PORT = 3000 } = process.env;

const app = express();

app.use(bodyParser.json());

app.use((req, res, next) => {
    req.user = {
      _id: '64a5939d55131cf774f2a2c6' // вставьте сюда _id созданного в предыдущем пункте пользователя
    };
  
    next();
  });

app.post('/signup', createUser);
app.use('/', routesUser);
app.use('/', routesMovie);

app.use('/', (req, res, next) => next(new NotFoundError('Произошла ошибка: Неправильный путь')));

app.use(errors());
app.use(handlerError);

mongoose.connect('mongodb://127.0.0.1:27017/bitfilmsdb');

app.listen(PORT, () => {
    console.log(`App listening on port ${PORT}`)
});
