const autoBind=require('auto-bind');
const moment = require('moment-jalaali');
moment.loadPersian({usePersianDigits:true,dialect:'persian-modern'});
const path = require('path');
module.exports=class helper{
    constructor(req,res){
        autoBind(this);
        this.req = req;
        this.res = res;
    }
    object(){
        return{
auth:this.auth(),
date:this.convertTime,
viewpath:this.viewpath,
req:this.req,
errors:this.req.flash('errors')
        }
    }
    auth(){
        return{
            check:this.req.isAuthenticated(),
            user:this.req.user
        }
    }
    convertTime(time){
        return moment(time)
    }
    viewpath(dir){
        return path.resolve(config.layout.VIEW_DIR+'/'+dir)
    }
}