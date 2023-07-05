const bcrypt = require('bcryptjs');
const BadRequest = require('../errors/BadRequestError');
const ForbiddenError = require('../errors/ForbiddenError');
const NotFound = require('../errors/NotFoundError');

const Movie = require('../models/movie');

const getMovies = (req, res, next) => {
    Movie.find({})
    .then((movies) => {
        res.send(movies);
    })
    .catch(next);
}

const createMovie = (req, res, next) => {

    const { 
        country, 
        director, 
        duration, 
        year, 
        description, 
        image, 
        trailerLink, 
        nameRU, 
        nameEN, 
        thumbnail,
    } = req.body; 

    Movie.create({ 
        country, 
        director, 
        duration,
        year, 
        description, 
        image, 
        trailerLink, 
        nameRU, 
        nameEN, 
        thumbnail,
        owner: req.user._id ,
    })
    .then((movie) => {
        res.send(movie);
    })
    .catch((err) => {
        if (err.name === 'ValidationError') {
          return next(new BadRequest('Переданы некорректные данные'));
        }
        return next(err);
      })
};

const deleteMovie = (req, res, next) => {
    const { id } = req.params;

    Movie.findById(id)
    .orFail(() => {
        throw new NotFound('Фильм не найден');
    })
    .then((movie) => {
        if (movie.owner.toString() === req.user._id) {
            return Movie.findByIdAndRemove(id)
            .then((movie) => {
                res.send(movie);
            })
            .catch(next);
        }

        return next(new ForbiddenError('В доступе отказано'))
    })
    .catch(next);
};

module.exports = {
    getMovies,
    createMovie,
    deleteMovie,
}