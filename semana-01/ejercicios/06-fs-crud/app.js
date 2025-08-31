/**
* const fs = require('node:fs/promises');
* const path = require('node:path');
* Create: Crear un archivo (fs.writeFile).
* Read: Leer un archivo (fs.readFile).
* Update: Modificar un archivo (fs.appendFile para añadir, o fs.* writeFile para sobreescribir).
* Delete: Borrar un archivo (fs.unlink).
* __dirname es una variable de ruta absoluta del directorio
* __filename es básicamente path.join(__dirname, 'nombre-del-archivo.js').
* process.cwd() devuelve el Directorio de Trabajo Actual
 */
const fs = require('node:fs/promises');
const path = require('node:path');

const filePath = path.join(__dirname, 'archivo-crud.txt');

(async () => {
  try {
    // --- CREATE ---
    console.log('1. CREANDO archivo...');
    await fs.writeFile(filePath, 'Contenido inicial del archivo');
    console.log('   Archivo creado con éxito.\n');

    // --- READ ---
    console.log('2. LEYENDO archivo...');
    const content = await fs.readFile(filePath, 'utf-8');
    console.log('   Contenido:', content, '\n');

    // --- UPDATE ---
    console.log('3. ACTUALIZANDO archivo (añadiendo contenido)...');
    await fs.appendFile(filePath, '\nTexto adicional añadido.');
    console.log('   Archivo actualizado con éxito.\n');

    // --- READ AGAIN ---
    console.log('4. LEYENDO archivo actualizado...');
    const updatedContent = await fs.readFile(filePath, 'utf-8');
    console.log('   Contenido actualizado:', updatedContent, '\n');

    // --- DELETE ---
    console.log('5. BORRANDO archivo...');
    await fs.unlink(filePath);
    console.log('   Archivo borrado con éxito.\n');

    // --- VERIFY DELETION ---
    console.log('6. INTENTANDO LEER archivo borrado...');
    await fs.readFile(filePath, 'utf-8');

  } catch (err) {
    // Este catch se activará en el último paso, porque el archivo ya no existe.
    console.error('   ERROR ESPERADO:', err.message);
    console.log('\n¡CRUD completado!');
  }
})();
