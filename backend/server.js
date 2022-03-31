const express = require("express");
const app = express();
const path = require('path');
const http = require("http");
const server = http.createServer(app);
const port = process.env.PORT || 8000;

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
    console.log("a user connected");
    socket.on("disconnect", () => { // ブラウザが切断したときの処理
        console.log("user disconnected");
    });
});

server.listen(port, () => {
    console.log("listen on 8000");
});