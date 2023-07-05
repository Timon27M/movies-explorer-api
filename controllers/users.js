const bcrypt = require('bcryptjs');

const BadRequestError = require('../errors/BadRequestError');
const NotFoundError = require('../errors/NotFoundError');

const User = require('../models/user');

const getUser = (req, res, next) => {
    User.findById(req.user._id)
    .orFail(() => {
        throw new NotFoundError('Пользователь не найден');
    })
    .then((user) => {
        res.send(user);
    })
    .catch((err) => {
        if (err.name === 'DocumentNotFoundError') {
          return next(new NotFoundError(err.name));
        }
        return next(err);
      });
}

const updateUser = (req, res, next) => {
  const { name, email } = req.body; 

    User.findByIdAndUpdate(
    req.user._id,
    { name, email },
    {
      new: true,
      runValidators: true,
    },
    )
    .orFail(() => {
        throw new NotFoundError('Пользователь не найден');
    })
    .then((user) => {
        res.send(user)
    })
    .catch((err) => {
        if (err.name === 'ValidationError') {
          return next(new BadRequestError(err.name));
        }
        return next(err);
      });
};

const createUser = (req, res, next) => {
    const {
      name,
      email,
      password,
    } = req.body;
  
    bcrypt.hash(password, 10)
      .then((hash) => User.create({
        name,
        email,
        password: hash,
      }))
      .then((user) => {
        res.status(200).send({
          name: user.name,
          email: user.email,
          _id: user._id,
        });
      })
      .catch((err) => {
        if (err.code === 11000) {
          return next(new IncorrectEmailError('Пользователь с таким email уже существует'));
        }
  
        if (err.name === 'ValidationError') {
            return next(new BadRequestError(err.name));
        }
        return next(err);
      })
  };

module.exports = {
    getUser,
    updateUser,
    createUser,
};
