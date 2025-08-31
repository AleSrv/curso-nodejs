// require('node:fs/promises') // .then /.catch
const fs = require('node:fs/promises'); // <- Nota que importamos la versión con promesas

console.log('Leyendo el archivo...');

fs.readFile('./archivo-que-no-existe.txt', 'utf-8')
  .then(text => {
    console.log('Contenido del archivo:', text);
  })
  .catch(err => {
    // ¡Aquí personalizamos el error!
    console.error('\n------------------------------------------------');
    console.error('¡Vaya! Ocurrió un error personalizado:');
    console.error('No se pudo encontrar el archivo que intentas leer.');
    console.error('------------------------------------------------\n');
    // Opcionalmente, también puedes mostrar el error original para depuración:
    // console.error('Error técnico original:', err);
  });

console.log('--> Haciendo otras cosas mientras tanto...');
