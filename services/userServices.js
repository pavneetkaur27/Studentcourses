var mongoose=require('mongoose');
var models=require('../models');

var saveUser =function (user,data,callback) {
    user.save(data,function (error,user) {
        if(error){
            callback(error,null);
        }else{
            callback(null,user);
        }
    })
};

var finddata = function (criteria, projections, options, callback) {
    options.lean = true;
    models.videos.find(criteria, projections, options, callback);
}

var findUser = function (criteria, projections, options, callback) {
    options.lean = true;
    models.users.find(criteria, projections, options, callback);
}

module.exports={
    'saveUser': saveUser,
    'finddata': finddata,
    'findUser':findUser
}
