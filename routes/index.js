var express = require('express');
var router = express.Router();
var session = require('express-session');
var bodyParser  = require('body-parser');
const controllers= require('../controllers');
var path = require('path');
var multer=require('multer')
var fs = require('fs');


router.get('/', function(req, res, next) {
  res.render('index', {err:'' });
});

router.post('/enroll', function(req, res, next) {
  username = req.body.username;
  if (req.body.username == "" && req.body.mobileno == "" && req.body.email == "" ) {
      res.render('index', {  msg: 'No field can be empty'})
  } else {
      controllers.userControllers.finddata({username: req.body.username}, {username: 1}, {}, (err, response) => {
          if (err) {
              res.send(err);
          }
          else {
              //console.log("hlo "+response[0]);
              if (response[0] != undefined) {
                  if (response[0].username == req.body.username) {
                      req.session.user = username;
                      res.render('course/dashboard',{userdetail:response});
                  }
              } else {
                  controllers.userControllers.saveUser(req.body, (err, user) => {
                      if (err) {
                          res.render('index', {err: err})
                      }
                      else {
                          req.session.user = username;
                          res.render('course/dashboard',{userdetail:user});
                      }
                  });
              }
          }
      })

  }
});

router.get('/videodisplay/:link',function (req,res) {
    var page=req.params.link;
    controllers.userControllers.finddata({},{},{},function (err,response) {
        if(err){
            return res.send(err);
        }else{

          res.render('course/videoMainPage',{data:response,id:page});
        }
    })
});

router.get('/videolectures/:section/:sublink',function (req,res) {
    var sectionname=req.params.section;
   // console.log(page);
    controllers.userControllers.finddata({section:sectionname},{},{},function (err,response) {
        if(err){
            return res.send(err);
        }else{
            controllers.userControllers.finddata({},{},{},function (error,data) {
                if(error){
                    return res.send(err);
                }else {
                    res.render('course/videoPlay', {desc: response[0].subSection[req.params.sublink], data: data});
                }
            });
        }
    })
});

router.get('/editProfile/:id',function (req,res) {
    controllers.userControllers.findUser({_id:req.params.id},{},{},function (error,data) {
        if(error){
            return res.send(error);
        }else {
            console.log(data);
            res.render('profile', {userdetail: data});
        }
    });

});

var upload = multer({
    dest:'../public/Upload/'
});

router.post('/editProfile/:id',upload.single('profilePhoto'),function (req,res) {
    console.log(req.file);
    // controllers.userControllers.updateProfile({_id:req.params.id},{profilephoto:},function (error,data) {
    //     if(error){
    //         return res.send(error);
    //     }else {
    //         res.render('course/dashboard',{userdetail:data});
    //     }
    // });

});

router.get('/logout', function (req,res) {
    req.session.destroy(function(err){
        if(err){
            return res.send(err);
        }
        else
        {
            res.redirect('/');
        }
    });
});


module.exports = router;
