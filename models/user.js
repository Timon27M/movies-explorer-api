const mongoose = require('mongoose');
const isEmail = require('validator/lib/isEmail');

const userSchema = new mongoose.Shema({
    name: {
        type: String,
        minlength: 2,
        maxlength: 30,
      },
      email: {
        type: String,
        require: true,
        unique: true,
        validate: {
          validator: (email) => isEmail(email),
          message: 'Неправильный адрес почты',
        },
      },
      password: {
        type: String,
        require: true,
        select: false,
      },
});

module.exports = mongoose.model('user', userSchema);