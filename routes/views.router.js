import { Router } from 'express';
import { ProductManager } from '../managers/productsManager.js';
const router = Router();
const pm = new ProductManager('./data/products.json');

router.get('/home', async (req, res) => {
  const products = await pm.getProducts();
  res.render('home', { products });
});

router.get('/realtimeproducts', (req, res) => {
  res.render('realTimeProducts');
});

export default router;