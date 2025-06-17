
import express from "express";
import fs from "fs/promises";
import { v4 as uuidv4 } from "uuid";

const app = express();
const PORT = 8080;

app.listen(PORT, () => {
  console.log(`Servidor escuchando en http://localhost:${PORT}`);
});

const readJSON = async path => {
  try {
    const txt = await fs.readFile(path, "utf-8");
    return JSON.parse(txt);
  } catch {
    await fs.writeFile(path, "[]");
    return [];
  }
};
const writeJSON = (path, data) =>
  fs.writeFile(path, JSON.stringify(data, null, 2));

app.use(express.json());

app.get("/api/products", async (req, res) => {
  const products = await readJSON("products.json");
  res.json(products);
});

app.get("/api/products/:pid", async (req, res) => {
  const products = await readJSON("products.json");
  const p = products.find(p => p.id === req.params.pid);
  if (!p) return res.status(404).json({ error: "No existe" });
  res.json(p);
});

app.post("/api/products", async (req, res) => {
  const products = await readJSON("products.json");
  const newProd = { id: uuidv4(), ...req.body };
  products.push(newProd);
  await writeJSON("products.json", products);
  res.status(201).json(newProd);
});

app.put("/api/products/:pid", async (req, res) => {
  const products = await readJSON("products.json");
  const idx = products.findIndex(p => p.id === req.params.pid);
  if (idx < 0) return res.status(404).json({ error: "No existe" });
  products[idx] = { ...products[idx], ...req.body, id: products[idx].id };
  await writeJSON("products.json", products);
  res.json(products[idx]);
});

app.delete("/api/products/:pid", async (req, res) => {
  let products = await readJSON("products.json");
  const antes = products.length;
  products = products.filter(p => p.id !== req.params.pid);
  if (products.length === antes)
    return res.status(404).json({ error: "No existe" });
  await writeJSON("products.json", products);
  res.json({ message: "Eliminado" });
});

app.post("/api/carts", async (req, res) => {
  const carts = await readJSON("carts.json");
  const newCart = { id: uuidv4(), products: [] };
  carts.push(newCart);
  await writeJSON("carts.json", carts);
  res.status(201).json(newCart);
});

app.get("/api/carts/:cid", async (req, res) => {
  const carts = await readJSON("carts.json");
  const c = carts.find(c => c.id === req.params.cid);
  if (!c) return res.status(404).json({ error: "No existe" });
  res.json(c);
});

app.post("/api/carts/:cid/product/:pid", async (req, res) => {
  const carts = await readJSON("carts.json");
  const cartsIdx = carts.findIndex(c => c.id === req.params.cid);
  if (cartsIdx < 0) return res.status(404).json({ error: "Carrito no existe" });

  const cart = carts[cartsIdx];
  const prodEntry = cart.products.find(p => p.product === req.params.pid);
  if (prodEntry) {
    prodEntry.quantity++;
  } else {
    cart.products.push({ product: req.params.pid, quantity: 1 });
  }

  carts[cartsIdx] = cart;
  await writeJSON("carts.json", carts);
  res.json(cart);
});
