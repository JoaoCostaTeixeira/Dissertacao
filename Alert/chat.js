/*
MSc Virtual Assistant for Mediating Meetings

Chat System

GitHub: https://github.com/JoaoCostaTeixeira/Dissertacao
Author : João Emanuel da Costa Teixeira

*/

//Packages used
const app = require('express')();
const http = require('http').Server(app);
var io = require('socket.io')(http);
const express = require('express')


// Add headers
app.use(express.json()) // for json
app.use(express.urlencoded({ extended: true })) // for form data
app.use(function (req, res, next) {

    // Website you wish to allow to connect
    res.setHeader('Access-Control-Allow-Origin', '*');

    // Request methods you wish to allow
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

    // Request headers you wish to allow
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');

    // Set to true if you need the website to include cookies in the requests sent
    // to the API (e.g. in case you use sessions)
    res.setHeader('Access-Control-Allow-Credentials', true);

    // Pass to next layer of middleware
    next();
});



io.on("connection", function(socket){
    socket.on('chat', function(data) {
      
        var s = data.split("_");
        console.log( s )
        io.emit( s[0],s[1] + "_" + s[2])
    })
})



http.listen(4001, function(){
    console.log('listening on port 4001')
})