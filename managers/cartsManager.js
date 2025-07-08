import fs from 'fs/promises';
import { v4 as uuidv4 } from 'uuid';

export class CartManager {
  constructor(filePath) {
    this.filePath = filePath;
  }
  
  async _read() {
    try {
      const data = await fs.readFile(this.filePath, 'utf-8');
      return JSON.parse(data);
    } catch {
      await fs.writeFile(this.filePath, '[]');
      return [];
    }
  }

  async _write(carts) {
    await fs.writeFile(this.filePath, JSON.stringify(carts, null, 2));
  }

  async getCarts() {
    return this._read();
  }

  async getCartById(id) {
    return (await this._read()).find(c => c.id === id);
  }

  async createCart() {
    const carts = await this._read();
    const newCart = { id: uuidv4(), products: [] };
    carts.push(newCart);
    await this._write(carts);
    return newCart;
  }

  async addProductToCart(cid, pid) {
    const carts = await this._read();
    const idx = carts.findIndex(c => c.id === cid);
    if (idx < 0) return null;
    const cart = carts[idx];
    const item = cart.products.find(p => p.product === pid);
    if (item) item.quantity++;
    else cart.products.push({ product: pid, quantity: 1 });
    carts[idx] = cart;
    await this._write(carts);
    return cart;
  }
}