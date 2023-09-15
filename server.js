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
        origin: "https://dev-response-dennisdingo28.vercel.app",
    } 
});


io.on("connection",(socket)=>{
    const id = socket.handshake.query.id;
    if(id && id.trim()!=='')
        socket.join(id);
    socket.on("new_bug",(bug)=>{
        io.emit("new_bug_client",bug);
    });
    socket.on("new_bug_amount",(bug)=>{
        io.emit("new_bug_client_amount",bug);
    });
    socket.on("new_bug_relevant",payload=>{
        io.emit("new_bug_relevant_client",payload);
    });
    socket.on("new_bug_unrelevant",payload=>{
        io.emit("new_bug_unrelevant_client",payload);
    });
    socket.on("new_bug_comment",payload=>{
        io.emit("new_bug_comment_client",payload);
    });
    socket.on("new_bug_request",payload=>{
        io.to(payload.userId).emit("new_bug_request_client",payload);
    });
    socket.on("new_response",payload=>{
        console.log(payload);
        io.to(payload.receiver).emit("new_response_client",{bug:payload.bug,comment:payload.comment,from:payload.from})
    });
    socket.on("bug_delete",payload=>{
        io.emit("bug_delete_client",payload);
    });
    socket.on("pingBug",payload=>{
        io.emit("pingBug_client",payload);
    });
    socket.on("bug_solved",payload=>{
        io.emit("bug_solved_client",payload);
    });
    socket.on("new_message",payload=>{
        io.to(payload.recipientId).emit("new_message_client",payload);

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