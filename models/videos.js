var mongoose = require('mongoose');

var sectionlist = mongoose.Schema({
        section                       :String,
        subSection                    :[{
            chapterName:String,
            chapterVideoName:String
        }]
         },
);

module.exports= mongoose.model('videolists',sectionlist);
