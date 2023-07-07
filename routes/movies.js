const router = require('express').Router();
const { getMovies, createMovie, deleteMovie } = require('../controllers/movies');

const { validationCreateMovie, validationDeleteMovie } = require('../middlewares/validators');

router.get('/movies', getMovies);
router.post('/movies', validationCreateMovie, createMovie);
router.delete('/movies/:id', validationDeleteMovie, deleteMovie);

module.exports = router;
