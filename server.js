import dotenv from 'dotenv';
import express from 'express';
import mongoose from 'mongoose';
import path from 'path';
import { fileURLToPath } from 'url';
import cookieParser from 'cookie-parser'
import hbs from 'express-handlebars';

import productRouter from './routes/api/products.router.js';
import cartRouter    from './routes/api/carts.router.js';
import viewsRouter   from './routes/views.router.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname  = path.dirname(__filename);

const app = express();

app.use(express.static(path.join(__dirname, 'public')));


mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('🚀 Conectado a MongoDB'))
.catch(err => console.error('❌ Error al conectar a MongoDB:', err));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use((req, res, next) => {
  const fixedCartId = '688591b5bd6655638ca6a381';
  res.cookie('cartId', fixedCartId, { httpOnly: true });
  req.cartId = fixedCartId;
  next();
});

import { engine } from 'express-handlebars';
app.engine('handlebars', engine());
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'handlebars');

app.use('/api/products', productRouter);
app.use('/api/carts',    cartRouter);
app.use('/', viewsRouter);
app.use('/carts', viewsRouter);


app.engine('handlebars', engine({
  helpers: {
    multiply: (a, b) => a * b
  }
}));

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Servidor escuchando en puerto ${PORT}`);
});