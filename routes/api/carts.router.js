import { Router } from "express";
import { CartManager } from "../../managers/cartsManager.js";
import { ProductManager } from "../../managers/productsManager.js";

const router = Router();
const cm = new CartManager("./data/carts.json");
const pm = new ProductManager("./data/products.json");

router.post("/", async (req, res) => {
  const newCart = await cm.createCart();
  res.status(201).json(newCart);
});

router.get("/:cid", async (req, res) => {
  const cart = await cm.getCartById(req.params.cid);
  if (!cart) return res.status(404).json({ error: "Carrito no existe" });
  res.json(cart);
});

router.post("/:cid/product/:pid", async (req, res) => {
  const cart = await cm.getCartById(req.params.cid);
  if (!cart) return res.status(404).json({ error: "Carrito no existe" });

  const prod = await pm.getProductById(req.params.pid);
  if (!prod) return res.status(404).json({ error: "Producto no existe" });

  const updatedCart = await cm.addProductToCart(req.params.cid, req.params.pid);
  res.json(updatedCart);
});

export default router;