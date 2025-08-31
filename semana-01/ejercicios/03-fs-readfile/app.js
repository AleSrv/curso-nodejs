// require('node:fs') // fs.readFileSync // fs.readFile

const fs = require('node:fs');

console.log('Leyendo el archivo (forma síncrona)...');
const text = fs.readFileSync('./archivo.txt', 'utf-8');
console.log('Contenido:', text);

console.log('\n-----------------------------------\n');


console.log('\nLeyendo el archivo (forma asíncrona)...');
fs.readFile('./archivo.txt', 'utf-8', (err, asyncText) => {
  if (err) {
    console.error('Error leyendo el archivo:', err);
    return;
  }
  console.log('Contenido asíncrono:', asyncText);
});

console.log('Haciendo otras cosas mientras se lee el archivo de forma asíncrona...');
