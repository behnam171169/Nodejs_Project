const autoBind=require('auto-bind');
const moment =require('moment-jalaali');
const Swal = require('sweetalert2');
class chatController{
    constructor(){
        autoBind(this);
        this.users=[];
    }
chatForm(req,res,next){
    res.render('admin/chat/chat')
}
chatRoom(req,res,next){
    // Swal.fire({
    //     title: 'چت انلاین',
    //     text: 'به سیستم چت انلاین خوش آمدید',
    //     type: 'info',
    //     confirmButtonText: 'Cool'
    // })
    res.render('admin/chat/chat-room');
}
connectToSocket(io){
    io.on('connection',socket=>{
        socket.on('join',(query,cb)=>{
     if(query.room='' || ! query.room){
         cb('چنین انجمنی وجود ندارد')
     }else{
         socket.join(query.room);
         this.UserRemove(socket.id);
         this.Userjoin(socket.id,query.user,query.room);
         io.to(query.room).emit('userList', this.UserList(query.room));
         socket.emit('userAdd',this.generateMessage('به این انجمن خوش آمدید','Admin'));
         socket.broadcast.to(query.room).emit('userAdd',this.generateMessage(`کاربر${query.user}وارد انجمن شد`,'Admin'));
     }
        })
        // socket.emit('chat message',{
        //     message:'wellcome to this froum',
        //     sender:'Admin'
        // })
        // socket.broadcast.emit('chat message',{
        //     message:'user join',
        //     sender:'Admin'
        // })

        socket.on('chat message',msg=>{
         let userInfo=this.GetUser(socket.id);
         if(userInfo){
             io.to(userInfo.room).emit('chat message',this.generateMessage(msg.message,msg.sender))
         }
        })
        socket.on('disconnect',()=>{
            let user=this.UserRemove(socket.id);
            if(user){
                io.to(user.room).emit('userList',this.UserList(user.room));
                io.to(user.room).emit('chat message',this.generateMessage(`کاربر${user.name}از انجمن خارج شد`,'Admin'))
            }
        })
    })

}
Userjoin(id,name,room){
    let user={id,name,room};
    this.users.push(user);
    return user;
}
UserRemove(id){
    let user = this.GetUser(id);
    if(user) {
        this.users = this.users.filter(user => user.id !== id)
    }
    return user;
}
UserList(room){
    let users = this.users.filter(user => user.room == room);
    let username = users.map(user => user.name);
    return username;
}
generateMessage(message,sender){
    return{
        message,
        sender,
        createdAt : moment().format('HH:mm')
    }
}
GetUser(id){
    return this.users.filter(user=>user.id==id)[0];
}
}
module.exports=new chatController();