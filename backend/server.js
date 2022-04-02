const express = require("express");
const app = express();
const path = require('path');
const http = require("http");
const server = http.createServer(app);

require('dotenv').config();

const port = process.env.PORT || 8000;

const mysql = require('mysql');

// //mysqlに接続
// const connection = mysql.createConnection({
//   host: process.env.MYSQL_HOST,
//   user: process.env.MYSQL_USER,
//   password: process.env.MYSQL_PASSWORD,
//   database: process.env.MYSQL_DATABASE
// });

// connection.connect(function(err) {
//     if (err) throw err;
//     console.log('Connected');
// });

app.use(express.static(path.join(__dirname, '../frontend/build')));

// 別オリジンからのアクセスを許可する（CORSモジュール利用）
const cors = require("cors");
app.use(cors());


app.get("/api", (req, res) => {
    res.json({ message: "hello world" });
});

app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname,'../frontend/build/index.html'));
});

// サーバーオブジェクトsocketioを作成する
const { Server } = require("socket.io");
const io = new Server(server, {
    cors: {                      
        origin: "*",
        methods: ["GET", "POST"],
    },
});

// ブラウザから接続されたときの処理を定義する
io.on("connection", (socket) => { // ブラウザから接続されたときの処理
    let i = 1;
    console.log("a user connected");
    socket.on("disconnect", () => { // ブラウザが切断したときの処理
        console.log("user disconnected");
    });

    socket.on("heartNum", (heartNum) => {
        i++;
        io.emit("heart", i);
        console.log(heartNum);
        
    });
});

server.listen(port, () => {
    console.log("listen on 8000");
});