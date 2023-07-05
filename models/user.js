const mongoose = require('mongoose');
const isEmail = require('validator/lib/isEmail');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        minlength: 2,
        maxlength: 30,
      },
      email: {
        type: String,
        required: true,
        unique: true,
        validate: {
          validator: (email) => isEmail(email),
          message: 'Неправильный адрес почты',
        },
      },
      password: {
        type: String,
        required: true,
        select: false,
      },
});

module.exports = mongoose.model('user', userSchema);