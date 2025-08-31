// http = require('node:http')
// const server = http.createServer((req, res) => {
// res.setHeader('Content-Type', 'text/html; charset=utf-8');
//  res.end('Hola mundo desde el servidor de Node.js!')
// })
// server.listen(3000)
// req.url ,   if (req.url === '/') // else if (req.url === '/contact') 
//  res.statusCode = 404
// Invoke-WebRequest -Method POST -Uri http://localhost:3000/contact



const http = require('node:http');

// Creamos el servidor. La función que le pasamos se ejecutará
// cada vez que llegue una petición.
const server = http.createServer((req, res) => {
  // req (request): contiene la información de la petición (URL, método, etc.)
  // res (response): es el objeto que usamos para enviar la respuesta al cliente.

  console.log(`Petición recibida para: ${req.url} con método: ${req.method}`);

  // Establecemos la cabecera Content-Type para indicar que es HTML y UTF-8
  res.setHeader('Content-Type', 'text/html; charset=utf-8');

  if (req.url === '/') {
    if (req.method === 'GET') {
      res.end('<h1>Bienvenido a la página de inicio!</h1>');
    } else {
      res.statusCode = 405; // Method Not Allowed
      res.end('<h1>Método no permitido para /</h1>');
    }
  } else if (req.url === '/contact') {
    if (req.method === 'GET') {
      res.end('<h1>Página de contacto</h1><p>Puedes contactarnos en info@example.com</p>');
    } else if (req.method === 'POST') {
      // Aquí es donde normalmente leerías los datos enviados en el cuerpo de la petición
      res.end('<h1>Datos de contacto recibidos (POST)!</h1>');
    } else {
      res.statusCode = 405; // Method Not Allowed
      res.end('<h1>Método no permitido para /contact</h1>');
    }
  } else {
    // Si la URL no coincide con ninguna ruta, enviamos un 404 Not Found
    res.statusCode = 404; // Establecemos el código de estado HTTP
    res.end('<h1>404 - Página no encontrada</h1>');
  }
});

// Ponemos el servidor a escuchar en el puerto 3000.
// El segundo argumento (la función callback) es opcional, se ejecuta
// una vez que el servidor está listo para recibir peticiones.
server.listen(3000, () => {
  console.log('Servidor escuchando en el puerto http://localhost:3000');
});
