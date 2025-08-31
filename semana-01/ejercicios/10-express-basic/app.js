// npm init -y (packetes node_modules, package.json)
// npm install express
// express = require('express')
// app.get('/', (req, res) =>{res.send (<></>)}
// app.get('/contact', (req, res) =>{res.send (<></>)}
// Middleware para manejar rutas no encontradas (404)
// Middleware : app.use((req, res) =>{res.send (<></>)}

const express = require('express');
const app = express();
const port = 3000;

// Definimos una ruta para la página de inicio
app.get('/', (req, res) => {
  res.send('<h1>¡Hola desde Express!</h1>');
});

// Definimos una ruta para la página de contacto
app.get('/contact', (req, res) => {
  res.send('<h1>Página de contacto de Express</h1><p>Esta es la página de contacto.</p>');
});

// Middleware para manejar rutas no encontradas (404)
app.use((req, res) => {
  res.status(404).send('<h1>404 - Página no encontrada con Express</h1>');
});

// Iniciamos el servidor
app.listen(port, () => {
  console.log(`Servidor Express escuchando en http://localhost:${port}`);
});
