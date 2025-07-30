# Backend Node Server - Ecommerce

Este proyecto es un backend para una tienda ecommerce, desarrollado con Node.js, Express, MongoDB y Handlebars. Permite gestionar productos y carritos de compra.

## Características principales
- Vista de detalle de producto
- Carrito de compras con edición y eliminación de productos
- Vistas dinámicas con Handlebars
- API REST para productos y carritos
- Middleware para gestión automática de carrito por usuario
- Conexión a MongoDB usando Mongoose


## Instalación
1. Clona el repositorio:
   ```bash
   git clone https://github.com/JesusRamos94/backend-node-server.git
   cd backend-node-server
   ```
2. Instala las dependencias:
   ```bash
   npm install
   ```
3. Inicia el servidor:
   ```bash
   npm start
   ```

## Uso
- Accede a `http://localhost:8080/products` para ver la tienda.
- Navega entre productos, agrega al carrito y gestiona tu compra.
- Accede a las rutas API para integración con otros sistemas.

## Scripts útiles
- `npm start`: Inicia el servidor en modo producción
- `npm run dev`: Inicia el servidor en modo desarrollo con nodemon

## Autor
- Jesus Ramos