var services=require('../services');
var mongoose=require('mongoose');
var models=require('../models');

var saveUser=function (data,callback) {
    var user=new models.users();
    user.username=data.username.toLowerCase();
    user.mobileno=data.mobileno;
    user.email=data.email;
    user.profilephoto='defaultpic.png';
    services.userServices.saveUser(user,data,function (err,user) {
        if(err){
            callback("Error while saving user");
            return;
        }
        else{
            callback(null,user);
        }
    });
};

var finddata = function (criteria, projection, option, callback) {
    services.userServices.finddata(criteria, projection, option, (err, list) => {
        if (err) {
            callback(err);
            return;
        } else {
            callback(err, list)
        }
    });
};

var findUser = function (criteria, projection, option, callback) {
    services.userServices.findUser(criteria, projection, option, (err, list) => {
        if (err) {
            callback(err);
            return;
        } else {
            callback(err, list)
        }
    });
};


var updateProfile = function(user,details,callback) {

    services.userServices.updateProfile(user,details, (err,response) => {
        if(err){
            callback(err);
        }
        else {
            callback(err,response);
        }
    });
}

module.exports={
    'saveUser' :  saveUser,
    'finddata' :  finddata,
    'updateProfile' :updateProfile,
    'findUser'      :findUser
};

