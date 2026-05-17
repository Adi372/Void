const express = require('express');
const authRouter = require('./routes/auth.routes');
const postRouter = require('./routes/post.routes');
const chatRouter = require('./routes/chat.routes');
const userRouter = require('./routes/user.routes');
const cookies = require('cookie-parser');

const app = express();
app.use(express.json());
app.use(cookies());

app.use('/api/auth', authRouter);
app.use('/api/post', postRouter);
app.use('/api/chat', chatRouter);
app.use('/api/user', userRouter);

module.exports = app;