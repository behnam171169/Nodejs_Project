const session=require('express-session');
const MongoStore=require('connect-mongo')(session);
const mongoose=require('mongoose');

module.exports={
    secret:'secretID' ,
    resave:true,
    saveUninitialized:true,
    store:new MongoStore({mongooseConnection:mongoose.connection}),
    // cookie:{secure:true}
}