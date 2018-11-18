var express = require('express');
var router = express.Router();
var session = require('express-session');
var bodyParser  = require('body-parser');
const controllers= require('../controllers');
var path = require('path');
var multer=require('multer')
var fs = require('fs');
var nodemailer = require('nodemailer');

router.get('/', function(req, res, next) {
  res.render('index', {err:'' });
});

router.post('/enroll', function(req, res, next) {
  username = req.body.username;
  //console.log(username);
  if (req.body.username == "" && req.body.mobileno == "" && req.body.email == "" ) {
      res.render('index', {  msg: 'No field can be empty'})
  } else {
      var transporter = nodemailer.createTransport({
          service: 'gmail',
          auth: {
              user: 'pavneetdemotest@gmail.com',
              pass: 'Pavi123@'
          }
      });

      var mailOptions = {
          from: 'pavneetkaur2797@gmail.com',
          to: req.body.email,
          subject: 'Join Eckovation course Group code',
          text: 'This is random email ..........Thanks'
      };

      transporter.sendMail(mailOptions, function(error, info){
          if (error) {
              console.log(error);
          } else {
              console.log('Email sent: ' + info.response);
          }
      });
      controllers.userControllers.findUser({username: req.body.username}, {}, {}, (err, response) => {
          if (err) {
              res.send(err);
          }
          else {
              console.log("hlo "+response[0]);
              if (response[0] != undefined) {
                  if (response[0].username == req.body.username) {
                      req.session.user = username;
                      res.render('course/dashboard',{userdetail:response[0]});
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
            res.render('profile', {userdetail: data[0]});
        }
    });
});

const storage =multer.diskStorage({
    destination:"./public/Upload/",
    filename:function (req,file,cb) {
        cb(null,Date.now()+path.extname(file.originalname));
    }
})
const upload = multer({
    storage:storage
});
router.post('/editProfile/:id',upload.single('profilePhoto'),function (req,res) {
  //  console.log(req.file);
    if(req.file!=null) {
        var allowedExtensions = [".png", ".jpg", ".jpeg"];
        var tempPath = req.file.path;
        var filePath = "../public/Upload/Product/" + req.file.filename;
        var targetPath = path.join(__dirname, filePath);
        // console.log(filename+" "+ filePath);
        filename = req.file.filename;
        controllers.userControllers.updateProfile({_id: req.params.id}, {profilephoto: filename}, function (error, data) {
            if (error) {
                return res.send(error);
            } else {
                controllers.userControllers.findUser({_id: req.params.id}, {}, {}, function (err, user) {
                    if (err) {
                        return res.send(error);
                    } else {
                        console.log(user);
                        res.render('course/dashboard', {userdetail: user[0]});
                    }
                })

            }
        });
    }
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


router.get('/sendmail',function (req,res) {


});
module.exports = router;
