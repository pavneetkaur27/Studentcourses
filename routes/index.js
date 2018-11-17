var express = require('express');
var router = express.Router();
var session = require('express-session');
var bodyParser  = require('body-parser');
const controllers= require('../controllers');
var path = require('path');
var fs = require('fs');

router.get('/', function(req, res, next) {
  res.render('index', {err:'' });
});

router.post('/enroll', function(req, res, next) {
  username = req.body.username;
  if (req.body.username == "" && req.body.mobileno == "" && req.body.email == "" ) {
      res.render('index', {  msg: 'No field can be empty'})
  } else {
      controllers.userControllers.saveUser(req.body, (err, response) => {
          if (err) {
              res.render('index', {err: err})
          }
          else {
              req.session.user = username;
              res.render('course/dashboard',{userdetail:response});
          }
      });
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
            controllers.userControllers.finddata({},{},{},function (err,data) {

                res.render('course/videoPlay', {desc: response[0].subSection[req.params.sublink], data:data});
            });
        }
    })
});

module.exports = router;
