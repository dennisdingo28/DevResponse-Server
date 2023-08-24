require('dotenv').config();

const http = require("http");
const express = require('express');
const {Server} = require("socket.io");

const helmet = require('helmet');
const cors = require('cors');
const PORT = process.env.PORT || 5000;


const app = express();
const server = http.createServer(app);

const io = new Server(server,{
    cors:{
        origin: "http://localhost:3000",
    } 
});


io.on("connection",(socket)=>{
    console.log('connection');
    console.log("newConnection",socket.id);
    socket.on("new_bug",(bug)=>{
        console.log(bug);
        io.emit("new_bug_client",bug);
    });
    socket.on("new_bug_amount",(bug)=>{
        io.emit("new_bug_client_amount",bug);
    });
});


app.use(express.json());
app.use(helmet());
app.use(cors()); 

app.get('/',(req,res)=>{
    res.status(200).send('This is the server')
});


server.listen(PORT,()=>{
    console.log(`Server is listening on port ${PORT}`);
});