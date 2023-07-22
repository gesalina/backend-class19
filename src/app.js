import express from "express";
import session from "express-session";
import handlebars from 'express-handlebars';
import {Server} from 'socket.io';
import mongoose from 'mongoose';
import productRouter from "../src/api/routers/products/product.router.js";
import cartRouter from "../src/api/routers/carts/cart.router.js";
import viewRouter from "../src/api/routers/main/view.router.js";
import chatRouter from "../src/api/routers/chat/chat.router.js"
import dotenv from 'dotenv';
import MongoStore from "connect-mongo";

dotenv.config()

const app = express();

/**
* Set the templates engine
*/
app.engine('handlebars', handlebars.engine());
app.set('views', './src/api/routers/views');
app.set('view engine', 'handlebars');

/**
 * User mongo sessions
 */
app.use(session({
    store: MongoStore.create({
        mongoUrl:`mongodb+srv://${process.env.USER}:${process.env.KEY}@cluster0.frrn8pq.mongodb.net/ecommerce`,
        dbName: 'sessions',
        mongoOptions:{
            useNewUrlParser: true,
            useUnifiedTopology: true
        }
    }),
    secret:'gsal',
    resave:true,
    saveUninitialized: true
}))

/**
* Middleware for parse to JSON 
*/
app.use(express.json())

/**
* Set the static folder
*/
app.use('/content', express.static('./public'));

// API ROUTES
app.use('/api/products', productRouter);
app.use('/api/carts', cartRouter);
app.use('/api/chat', chatRouter);

// VIEW ROUTER
app.use('/', viewRouter);


/**
* Establish database connection
*/
let serverHttp;

try {
    await mongoose.connect(`mongodb+srv://${process.env.USER}:${process.env.KEY}@cluster0.frrn8pq.mongodb.net/ecommerce`)
    serverHttp = app.listen(8080, () => console.log(`Running server`));                                                      
} catch(err) {
    console.log(err)
}

/**
* Establish websocket 
*/
const io = new Server(serverHttp);  

app.set('socketio', io);

io.on('connection', socket => {
    console.log("Client connected");
    socket.on('productList', data => {
        io.emit('updateProducts', data);
    });
    socket.on('messages', data => {
        io.emit('logs', data);
    })
})
