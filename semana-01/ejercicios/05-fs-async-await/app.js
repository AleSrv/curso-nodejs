//  require('node:fs/promises') // (async () => { try { } catch (err) {}})
const { readFile } = require('node:fs/promises');

// Para poder usar await en el cuerpo principal de un módulo,
// lo envolvemos en una función anónima autoinvocada (IIFE).
(
  async () => {
    console.log('Leyendo el archivo con async/await...');
    try {
      // 'await' pausa la ejecución de la función AQUÍ hasta que la promesa de readFile se resuelva.
      // El código parece síncrono, pero sigue siendo asíncrono por debajo.
      const text = await readFile('./archivo.txt', 'utf-8');
      console.log('Contenido del archivo:', text);
    } catch (err) {
      // El error se captura con un try...catch, igual que en el código síncrono tradicional.
      console.error('Error al leer el archivo:', err);
    }
  }
)();
