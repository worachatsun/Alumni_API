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
            }else{
                const add_user = users.filter(user => user.id === userinfo.id)
                if(!add_user.length){
                    userinfo.socketId = socket.id
                    users.push(userinfo)
                }
            }
            socket.emit('allUsers', users)
        })

        socket.on('sendMsg', data => {
            Inbox.findOne({'room_id': data.user.id}, (err, user) => {
                if(err) { return console.log(err) }
                console.log(user)
            })
            //io.to(data.user.socketId).emit('getMsg', {msg: 'sun'})
        })

        socket.on('disconnect', () => {
            console.log('user disconnected')
        })
    })
}