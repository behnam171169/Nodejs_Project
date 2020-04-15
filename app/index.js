const express = require('express');
const http=require('http');
const path=require('path');
const app = express();
const session=require('express-session');
const MongoStore=require('connect-mongo')(session);
const expressLayouts=require('express-ejs-layouts');
const bodyParser=require('body-parser');
const mongoose=require('mongoose');
const cookieParser=require('cookie-parser');
const flash=require('connect-flash');
const passport=require('passport');
var methodOverride = require('method-override');
const rememberLogin=require('app/http/middleware/rememberLogin')

module.exports=class Application{
    constructor(){
        this.configServer();
        this.configDatabase();
        this.setConfig();
        this.setRoutes();
    }
    configServer(){
        const server=http.createServer(app);
    
   
        server.listen(5000,(err)=>{
            if(err) console.log(err)
            console.log('ok')
        })
    }

    configDatabase(){
mongoose.Promise=global.Promise;
mongoose.connect(config.database.url);
    }
    setConfig(){
        require('./passport/passport-local');
        require('./passport/passport-google');
        app.use(express.static(config.layout.PUBLIC_DIR));
        app.set('view engine',config.layout.VIEW_ENGINE);
        app.set('views',config.layout.VIEW_DIR);
        app.use(config.layout.EJS.expressLayouts);
        app.set('layout',config.layout.EJS.master);
       app.set('layout extractScripts',config.layout.EJS.extractScripts);
       app.set('layout extractStyles',config.layout.EJS.extractStyles);
       app.set(bodyParser.json());
       app.use(bodyParser.urlencoded({extended:true}));
       app.use(session({...config.session}));
       app.use(cookieParser('secretID'));
  app.use(flash());
  app.use(passport.initialize());
  app.use(passport.session());
  app.use(rememberLogin.handle);
  app.use(methodOverride('_method'));
app.use((req,res,next)=>{
    app.locals={
        auth:{
            check:req.isAuthenticated(),
            user:req.user
        }
    }
    next();
})
    }
    setRoutes(){
      app.use(require('./routes'))
       
    }
}