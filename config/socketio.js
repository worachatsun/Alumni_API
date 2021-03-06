const Inbox = require('mongoose').model('inbox')

module.exports = (server, db) => {
    const io = require('socket.io')(server)
    let users = []

    io.on('connection', (socket) => {  
        console.log('a user connected')
        console.log(users, 'in server users')
        socket.on('userInfo', userinfo => {
            console.log(userinfo, 'info')
            if(users.length === 0){
                userinfo.socketId = socket.id
                users.push(userinfo)
                socket.join(userinfo.id)
            }else{
                const add_user = users.filter(user => user.id === userinfo.id)
                if(!add_user.length){
                    userinfo.socketId = socket.id
                    users.push(userinfo)
                    socket.join(userinfo.id)
                }
            }
            socket.emit('allUsers', users)
        })

        socket.on('sendMsg', data => {
            const sel = users.filter(user => {
                return user.id == data.room
            })
            console.log(users, 'users')
            console.log(data, 'to')
            if(sel.length){
                console.log(sel.length)
                io.sockets.in(data.room).emit('getMsg', data)
            }
            // Inbox.findOne({'room_id': data.room}, (err, inboxs) => {
            //     if(err) { return console.log(err) }
            //     console.log(inboxs, 'inboxs')
            // })
        })

        socket.on('joinRoom', room => {
            socket.join(room)
            console.log(room)
        })

        socket.on('leaveRoom', room => {
            socket.leave(room)
        })

        socket.on('disconnect', () => {
            console.log('user disconnected T^T')
        })
    })
}