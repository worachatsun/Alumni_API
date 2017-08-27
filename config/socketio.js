const Inbox = require('mongoose').model('inbox')

module.exports = (server, db) => {
    const io = require('socket.io')(server)
    let users = []

    io.on('connection', (socket) => {  
        console.log('a user connected')
        
        socket.on('userInfo', userinfo => {
            if(users.length === 0){
                userinfo.socketId = socket.id
                users.push(userinfo)
                socket.join(userinfo.id)
                io.to(userinfo.id).emit('getMsg', userinfo)
                // socket.broadcast.to(socket.id).emit('getMsg', {userinfo})
            }else{
                const add_user = users.filter(user => user.id === userinfo.id)
                if(!add_user.length){
                    userinfo.socketId = socket.id
                    users.push(userinfo)
                    socket.join(userinfo.id)
                    // io.broadcast.to(socket.id).emit('getMsg', {userinfo})
                }
            }
            socket.emit('allUsers', users)
            // io.to("jrgmNja-jP8le50OAAAb").emit('getMsg', {msg: 'sun'})
        })

        socket.on('sendMsg', data => {
            console.log(data, 'as')
            Inbox.findOne({'room_id': data.user.id}, (err, user) => {
                if(err) { return console.log(err) }
                console.log(user, 'user')
            })
        })

        socket.on('disconnect', () => {
            console.log('user disconnected T^T')
        })
    })
}