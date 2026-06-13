const express = require('express');
const authRouter = require('./routes/auth.routes');
const postRouter = require('./routes/post.routes');
const chatRouter = require('./routes/chat.routes');
const userRouter = require('./routes/user.routes');
const aiRouter = require('./routes/aiChat.routes');
const cookies = require('cookie-parser');
const cors = require('cors');
const path = require('path');

const app = express();

app.use(cors({
    origin: "http://localhost:5173",
    credentials: true
}));

app.use(express.json());
app.use(cookies());
app.use(express.static(path.join(__dirname, '../public')));

app.use('/api/auth', authRouter);
app.use('/api/post', postRouter);
app.use('/api/chat', chatRouter);
app.use('/api/user', userRouter);
app.use('/api/aiChat', aiRouter)

app.get("*name", (req, res)=>{
    res.sendFile(path.join(__dirname, '../public/index.html'));
});

module.exports = app;