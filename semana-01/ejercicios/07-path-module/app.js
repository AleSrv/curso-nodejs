//path = require('node:path');
// path.sep // filePath // baseName // fileName // extension
const path = require('node:path');


// Muestra el separador de rutas para este sistema operativo (e.g., \ en Windows, / en Linux/macOS)
console.log(`Separador de rutas: ${path.sep}`);

// Unir partes de una ruta de forma segura
const filePath = path.join('contenido', 'subcarpeta', 'archivo.txt');
console.log(`Ruta construida: ${filePath}`);

// Obtener el nombre del archivo de la ruta
const baseName = path.basename('/tmp/midu-secret-files/password.txt');
console.log(`Nombre del archivo: ${baseName}`);

// Obtener el nombre del archivo sin la extensión
const fileName = path.basename('/tmp/midu-secret-files/password.txt', '.txt');
console.log(`Nombre del archivo sin extensión: ${fileName}`);

// Obtener la extensión del archivo
const extension = path.extname('my.super.image.jpg');
console.log(`Extensión del archivo: ${extension}`);
