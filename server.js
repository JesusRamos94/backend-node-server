import express from 'express';
import { createServer } from 'http';
import { Server as IOServer } from 'socket.io';
import { engine } from 'express-handlebars';
import path from 'path';

import productsRouter from './routes/api/products.router.js';
import cartsRouter    from './routes/api/carts.router.js';
import viewsRouter    from './routes/views.router.js';

import { ProductManager } from './managers/productsManager.js';

const app = express();
const server = createServer(app);
const io = new IOServer(server);
const pm = new ProductManager('./data/products.json');

app.engine('handlebars', engine({ layoutsDir: 'views/layouts', defaultLayout: 'main' }));
app.set('view engine', 'handlebars');
app.set('views', 'views');
app.use(express.json());
app.use(express.static('public'));

// Montar rutas
app.use('/', viewsRouter);
app.use('/api/products', productsRouter);
app.use('/api/carts', cartsRouter);

// Socket.io
io.on('connection', async socket => {
  socket.emit('updateProducts', await pm.getProducts());
  socket.on('addProduct', async data => {
    await pm.addProduct(data);
    io.emit('updateProducts', await pm.getProducts());
  });
  socket.on('deleteProduct', async id => {
    await pm.deleteProduct(id);
    io.emit('updateProducts', await pm.getProducts());
  });
});

server.listen(8080, () => console.log('Escuchando puerto 8080'));