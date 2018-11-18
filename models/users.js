var mongoose = require('mongoose');

var login = mongoose.Schema({
        username                        :String,
        mobileno                        :String,
        email                           :String,
        profilephoto                    :String
       },
);

module.exports= mongoose.model('userdetails',login);
