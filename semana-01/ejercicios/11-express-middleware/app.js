// app.use((req, res, next) 
// app.use(express.json());
// app.use(express.static(path.join(__dirname, 'public')));
// app.get('/', (req, res) => 
// app.post('/api/data', (req, res) => 
// 

const express = require('express');
const path = require('node:path');
const app = express();
const port = 3000;

// 1. Middleware de Logging personalizado
// Este middleware se ejecuta para CADA petición que llega al servidor.
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next(); // Llama a la siguiente función de middleware en la pila
});

// 2. Middleware para parsear JSON en el cuerpo de las peticiones (POST, PUT)
// Esto es necesario para poder leer datos enviados en formato JSON.
app.use(express.json());

// 3. Middleware para servir archivos estáticos
// Sirve los archivos de la carpeta 'public' automáticamente.
// Si una petición coincide con un archivo en 'public', lo sirve y no pasa al siguiente middleware/ruta.
app.use(express.static(path.join(__dirname, 'public')));

// Rutas de ejemplo

// Ruta para la página de inicio (ya cubierta por express.static si existe index.html)
// Si no existiera index.html en public, esta ruta se ejecutaría para '/'
app.get('/', (req, res) => {
  res.send('<h1>Bienvenido a la página de inicio (desde la ruta GET /)!</h1>');
});

// Ruta para una API que recibe datos JSON
app.post('/api/data', (req, res) => {
  console.log('Datos recibidos en POST /api/data:', req.body);
  res.json({ message: 'Datos recibidos correctamente', data: req.body });
});

// Ruta de contacto
app.get('/contact', (req, res) => {
  res.send('<h1>Página de contacto</h1><p>Contáctanos en info@example.com</p>');
});

// 4. Middleware para manejar rutas no encontradas (404)
// Este middleware se coloca al final, después de todas las rutas y otros middleware,
// para que solo se ejecute si ninguna ruta anterior ha manejado la petición.
app.use((req, res) => {
  res.status(404).send('<h1>404 - Página no encontrada</h1><p>La URL solicitada no existe.</p>');
});

// Iniciamos el servidor
app.listen(port, () => {
  console.log(`Servidor Express con Middleware escuchando en http://localhost:${port}`);
});
