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
    models.videos.find(criteria, projections, options, callback);
}

var findUser = function (criteria, projections, options, callback) {
    models.users.find(criteria, projections, options, callback);
}

var updateProfile = function (user,details, callback) {
    models.users.updateOne({_id:user._id},details,callback);
}

module.exports={
    'saveUser': saveUser,
    'finddata': finddata,
    'findUser':findUser,
    'updateProfile':updateProfile
}
