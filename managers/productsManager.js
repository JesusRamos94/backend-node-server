import fs from 'fs/promises';
import { v4 as uuidv4 } from 'uuid';

export class ProductManager {
  constructor(filePath) {
    this.filePath = filePath;
  }

  async _read() {
    try {
      return JSON.parse(await fs.readFile(this.filePath, 'utf-8'));
    } catch {
      await fs.writeFile(this.filePath, '[]');
      return [];
    }
  }

  async _write(data) {
    await fs.writeFile(this.filePath, JSON.stringify(data, null, 2));
  }

  async getProducts() {
    return this._read();
  }

  async getProductById(id) {
    return (await this._read()).find(p => p.id === id);
  }

  async addProduct(data) {
    const products = await this._read();
    const newProd = { id: uuidv4(), ...data };
    products.push(newProd);
    await this._write(products);
    return newProd;
  }

  async updateProduct(id, fields) {
    const products = await this._read();
    const idx = products.findIndex(p => p.id === id);
    if (idx < 0) return null;
    products[idx] = { ...products[idx], ...fields, id };
    await this._write(products);
    return products[idx];
  }

  async deleteProduct(id) {
    const products = await this._read();
    const filtered = products.filter(p => p.id !== id);
    if (filtered.length === products.length) return false;
    await this._write(filtered);
    return true;
  }
}