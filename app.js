const express = require('express');
const mongoose = require('mongoose');
const authRouter = require('./authRouter');
const PORT = 5000;
const CONNECTION = `mongodb+srv://Mikhail:1@cluster0.6gdtl.mongodb.net/auth_roles?retryWrites=true&w=majority`;
const app = express();

app.use(express.json());
app.use('/auth', authRouter);

async function start() {
    try {
        mongoose.connect(CONNECTION);
        app.listen(PORT, () => {
            console.log(`server started on port ${PORT}`);
        });
    } catch (e) {
        console.log(e);
    }
}

start();
