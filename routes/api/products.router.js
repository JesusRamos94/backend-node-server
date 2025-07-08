import { Router } from 'express';
import { ProductManager } from '../../managers/productsManager.js';
const pm = new ProductManager('./data/products.json');
const router = Router();

router.get('/', async (_, res) => {
  res.json(await pm.getProducts());
});

router.get('/:pid', async (req, res) => {
  const p = await pm.getProductById(req.params.pid);
  if (!p) return res.status(404).json({ error: 'No existe' });
  res.json(p);
});

router.post('/', async (req, res) => {
  const newP = await pm.addProduct(req.body);
  io.emit('updateProducts', await pm.getProducts());
  res.status(201).json(newP);
});

export default router;