require("dotenv").config();
const express = require('express');
const app = express();
const http = require('http');
const { Server } = require('socket.io');
const cors = require("cors");
const path = require('path');
const fs = require('fs');
const port = process.env.PORT || 5000;
const connectMongoDb = require('./services/mongodb');
const cookieParser = require("cookie-parser");
const createImageUploadWorker = require("./services/imageService");
const { createEmailWorker } = require("./services/mailService");
const authRouter = require("./routes/authRouter");
const userRouter = require("./routes/userRouter");
const adminRouter = require("./routes/adminRouter");
const { socketEvents } = require("./socket/events");

const server = http.createServer(app);

const io=new Server(server,{cors:{credentials:true,origin:process.env.APP_URL}})

app.set("io",io);

app.use(cors({credentials:true,origin:process.env.APP_URL}))

connectMongoDb();
createImageUploadWorker();
createEmailWorker();

app.use(cookieParser());

const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)){
    fs.mkdirSync(uploadsDir);
}

app.use('/uploads', express.static(uploadsDir));
socketEvents(io);
app.use(express.json());
app.use("/auth", authRouter);
app.use("/user", userRouter);
app.use("/admin", adminRouter);

app.get('/', (req, res) => {
  res.send('Hello, dgasfghkl!');
});

server.listen(port, async () => {
  console.log(`Server is running on http://localhost:${port}`);
});