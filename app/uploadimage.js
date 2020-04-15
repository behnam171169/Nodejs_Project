const multer = require('multer');
const fs = require('fs');
const mkdirp = require('mkdirp');
const path = require('path');
const getDir = ()=>{
    let year = new Date().getFullYear();
    let month = new Date().getMonth();
    let day = new Date().getDate();

    return `./public/uploads/Images/${year}/${month}/${day}`;
}

const storageImage = multer.diskStorage({
    destination : (req, file, cb) => {
        let dir = getDir();
        mkdirp(dir).then(made =>{
            // if(err) console.log(err)
            cb(null, dir);
        }
           
          )

        // mkdirp(dir , (err) => {
        //     if(err) console.log(err)
        //     cb(null, dir);
        // })
    }, 
    filename : (req, file, cb)=>{
        let filePath = getDir() + '/' + file.originalname;
        if(! fs.existsSync(filePath)){
            cb(null , file.originalname);
        }else {
            cb(null, Date.now() + '-' + file.originalname);
        }
    }
})

const uploadImage = multer({
    storage : storageImage,
    limits : {
        fileSize : 1024 * 1024 * 5
    },
})

module.exports = uploadImage;