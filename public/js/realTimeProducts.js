const socket = io();
const grid = document.getElementById('prodGrid');
const form = document.getElementById('addForm');

socket.on('updateProducts', products => {
  grid.innerHTML = products.map(p => `
    <div class="grid-item">
      <strong>Producto:</strong> ${p.producto}<br>
      <strong>Color:</strong> ${p.color}<br>
      <strong>Marca:</strong> ${p.description}<br>
      <strong>Código:</strong> ${p.code}<br>
      <strong>Precio:</strong> ${p.price} CLP<br>
      <strong>Stock:</strong> ${p.stock}
      <button class="delete-btn" data-id="${p.id}">🗑</button>
    </div>
  `).join('');

  document.querySelectorAll('.delete-btn').forEach(btn =>
    btn.onclick = () => socket.emit('deleteProduct', btn.dataset.id)
  );
});

form.addEventListener('submit', e => {
  e.preventDefault();
  const data = {
    producto:    e.target.producto.value,
    color:       e.target.color.value,
    description: e.target.marca.value,
    code:        e.target.codigo.value,
    price:       parseFloat(e.target.precio.value),
    stock:       parseInt(e.target.stock.value, 10),
  };
  socket.emit('addProduct', data);
  form.reset();
});