import { Router } from 'express';
import Product from '../models/Product.js';
import Cart    from '../models/Cart.js';

const router = Router();

router.post('/carts/:cid/update/:pid', async (req, res) => {
  try {
    const { cid, pid } = req.params;
    const qty = parseInt(req.body.quantity);
    if (isNaN(qty) || qty < 1) return res.status(400).send('Cantidad inválida');
    const cart = await Cart.findOneAndUpdate(
      { _id: cid, 'products.product': pid },
      { $set: { 'products.$.quantity': qty } },
      { new: true }
    );
    if (!cart) return res.status(404).send('Carrito o producto no encontrado');
    res.redirect(`/carts/${cid}`);
  } catch (error) {
    console.error('Error actualizando cantidad:', error);
    res.status(500).send('Error interno');
  }
});

router.post('/carts/:cid/remove/:pid', async (req, res) => {
  try {
    const { cid, pid } = req.params;
    const cart = await Cart.findByIdAndUpdate(
      cid,
      { $pull: { products: { product: pid } } },
      { new: true }
    );
    if (!cart) return res.status(404).send('Carrito o producto no encontrado');
    res.redirect(`/carts/${cid}`);
  } catch (error) {
    console.error('Error eliminando producto:', error);
    res.status(500).send('Error interno');
  }
});

router.post('/carts/:cid/add/:pid', async (req, res) => {
  try {
    const { cid, pid } = req.params;
    const qty = req.body.quantity ? parseInt(req.body.quantity) : 1;
    const cart = await Cart.findById(cid);
    if (!cart) return res.status(404).send('Carrito no encontrado');
    const existing = cart.products.find(item => item.product.toString() === pid);
    if (existing) {
      existing.quantity += qty;
    } else {
      cart.products.push({ product: pid, quantity: qty });
    }
    await cart.save();
    res.redirect(`/carts/${cid}`);
  } catch (error) {
    console.error('Error agregando producto al carrito desde vista:', error);
    res.status(500).send('Error interno');
  }
});

router.get('/products', async (req, res) => {
  try {
    let { limit = 10, page = 1, sort, query } = req.query;
    limit = parseInt(limit) || 10;
    page  = parseInt(page)  || 1;

    const filter = {};
    if (query) {
      if (query === 'true' || query === 'false') filter.status = query === 'true';
      else filter.category = query;
    }

    let sortOption = {};
    if (sort === 'asc')  sortOption = { price: 1 };
    if (sort === 'desc') sortOption = { price: -1 };

    const options = { page, limit, sort: sortOption, lean: true };
    const result = await Product.paginate(filter, options);

    const baseURL = `/products?limit=${limit}`
                  + (sort ? `&sort=${sort}` : '')
                  + (query ? `&query=${query}` : '');

    res.render('index', {
      products:    result.docs,
      page:        result.page,
      totalPages:  result.totalPages,
      hasPrevPage: result.hasPrevPage,
      hasNextPage: result.hasNextPage,
      prevLink:    result.hasPrevPage ? `${baseURL}&page=${result.prevPage}` : null,
      nextLink:    result.hasNextPage ? `${baseURL}&page=${result.nextPage}` : null,
      cartId: req.cartId
    });
  } catch (error) {
    console.error(error);
    res.status(500).send('Error al cargar productos');
  }
});

router.get('/products/:pid', async (req, res) => {
  try {
    const product = await Product.findById(req.params.pid).lean();
    if (!product) {
      console.log('❌ Producto no encontrado:', req.params.pid);
      return res.status(404).send('Producto no encontrado');
    }
    const cartId = req.cartId;
    res.render('product', { product, cartId });
  } catch (error) {
    console.error(error);
    res.status(500).send('Error al cargar detalle');
  }
});

router.get('/carts/:cid', async (req, res) => {
  try {
    const cart = await Cart.findById(req.params.cid)
                            .populate('products.product')
                            .lean();
    if (!cart) return res.status(404).send('Carrito no encontrado');
    res.render('cart', { cart, products: cart.products });
  } catch (error) {
    console.error(error);
    res.status(500).send('Error al cargar carrito');
  }
});

export default router;