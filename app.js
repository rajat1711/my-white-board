const express = require("express");
const socket = require("socket.io");

const app = express();

app.use(express.static("public"))
let port = 9006;
let server = app.listen(port , () =>{
    console.log(`Listening at port ${port}`);
});

let io = socket(server);

io.on("connection", (socket) =>{
    console.log("Made Socket Connection");

    //data recieved
    socket.on("beginPath", (data) => {
        //transfer data to all other connected computers
        io.sockets.emit("beginPath", data);
    })

    socket.on("drawLine", (data) =>{
        io.sockets.emit("drawLine" ,data);
    })
    socket.on("undoRedo", (data)=>{
        io.sockets.emit("undoRedo", data);
    });
})
