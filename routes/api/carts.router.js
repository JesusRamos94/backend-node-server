import { Router } from 'express';
import Cart from '../../models/Cart.js';

const router = Router();

router.post('/:cid/products/:pid', async (req, res) => {
  try {
    const { cid, pid } = req.params;
    const qty = req.body.quantity ? parseInt(req.body.quantity) : 1;
    const cart = await Cart.findById(cid);
    if (!cart) {
      return res.status(404).json({ status: 'error', error: 'Carrito no encontrado' });
    }
    const existing = cart.products.find(item => item.product.toString() === pid);
    if (existing) {
      existing.quantity += qty;
    } else {
      cart.products.push({ product: pid, quantity: qty });
    }
    const updated = await cart.save();
    return res.redirect(`/carts/${cid}`);
  } catch (error) {
    console.error('Error agregando producto al carrito:', error);
    res.status(500).json({ status: 'error', error: 'Error interno' });
  }
});

router.get('/:cid', async (req, res) => {
  try {
    const cart = await Cart.findById(req.params.cid)
                           .populate('products.product')
                           .lean();
    if (!cart) return res.status(404).json({ status: 'error', error: 'Carrito no encontrado' });
    res.json({ status: 'success', cart });
  } catch (error) {
    console.error(error);
    res.status(500).json({ status: 'error', error: 'Error interno' });
  }
});

router.delete('/:cid/products/:pid', async (req, res) => {
  try {
    const updated = await Cart.findByIdAndUpdate(
      req.params.cid,
      { $pull: { products: { product: req.params.pid } } },
      { new: true }
    );
    if (!updated) return res.status(404).json({ status: 'error', error: 'Carrito no encontrado' });
    res.json({ status: 'success', message: 'Producto eliminado', cart: updated });
  } catch (error) {
    console.error(error);
    res.status(500).json({ status: 'error', error: 'Error interno' });
  }
});

router.put('/:cid', async (req, res) => {
  try {
    const updated = await Cart.findByIdAndUpdate(
      req.params.cid,
      { products: req.body },  
      { new: true }
    );
    if (!updated) return res.status(404).json({ status: 'error', error: 'Carrito no encontrado' });
    res.json({ status: 'success', message: 'Carrito actualizado', cart: updated });
  } catch (error) {
    console.error(error);
    res.status(500).json({ status: 'error', error: 'Error interno' });
  }
});

router.put('/:cid/products/:pid', async (req, res) => {
  try {
    const qty = parseInt(req.body.quantity);
    if (isNaN(qty) || qty < 1) {
      return res.status(400).json({ status: 'error', error: 'Cantidad inválida' });
    }
    const cart = await Cart.findOneAndUpdate(
      { _id: req.params.cid, 'products.product': req.params.pid },
      { $set: { 'products.$.quantity': qty } },
      { new: true }
    );
    if (!cart) return res.status(404).json({ status: 'error', error: 'No encontrado' });
    res.json({ status: 'success', message: 'Cantidad actualizada', cart });
  } catch (error) {
    console.error(error);
    res.status(500).json({ status: 'error', error: 'Error interno' });
  }
});

router.delete('/:cid', async (req, res) => {
  try {
    const updated = await Cart.findByIdAndUpdate(
      req.params.cid,
      { $set: { products: [] } },
      { new: true }
    );
    if (!updated) return res.status(404).json({ status: 'error', error: 'Carrito no encontrado' });
    res.json({ status: 'success', message: 'Carrito vaciado', cart: updated });
  } catch (error) {
    console.error(error);
    res.status(500).json({ status: 'error', error: 'Error interno' });
  }
});

export default router;