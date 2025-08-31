# Resumen Detallado de Lecciones de NodeJS

Aquí tienes un resumen detallado de cada lección que hemos cubierto, con el código fuente y una explicación de su funcionamiento, similar a como lo hemos visto en nuestro chat.

---

## Lección 1: Hola Mundo (`01-hola-mundo`)

### Código
```javascript
// >> node app.js
console.log('Hola, mundo');
```

### Explicación
Este es el punto de partida más básico.
- **`console.log()`**: Es una función fundamental de Node.js (y de JavaScript en general) que se utiliza para imprimir mensajes en la terminal o consola.
- **Ejecución**: Al correr `node app.js` en la terminal, el motor de Node.js simplemente ejecuta este código y muestra el texto "Hola, mundo".

---

## Lección 2: Módulo OS (`02-os-info`)

### Código
```javascript
// require('node:os');
//os.platform // os.release // os.arch // os.cpus().length 
//os.freemem() //  os.totalmem // os.uptime
const os = require('node:os');

console.log('Información del sistema operativo:');
console.log('-----------------------------------');

console.log('Nombre del sistema operativo:', os.platform());
console.log('Versión del sistema operativo:', os.release());
console.log('Arquitectura:', os.arch());
console.log('CPUs:', os.cpus().length);
console.log('Memoria libre (MB):', os.freemem() / 1024 / 1024);
console.log('Memoria total (MB):', os.totalmem() / 1024 / 1024);
console.log('Tiempo encendido (horas):', os.uptime() / 60 / 60);
```

### Explicación
Esta lección introduce el concepto de **módulos** en Node.js, que son librerías de código que podemos reutilizar.
- **`require('node:os')`**: Importa el módulo `os` nativo de Node.js. El prefijo `node:` indica que es un módulo interno. Este módulo proporciona utilidades relacionadas con el sistema operativo.
- **`os.platform()`**, **`os.release()`**, etc.: Son funciones del módulo `os` que nos dan acceso a información específica del sistema donde se está ejecutando el script.

---

## Lección 3: Módulo File System - Callbacks (`03-fs-readfile`)

### Código
```javascript
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
```


### Explicación
Introduce la **asincronía** de Node.js usando el módulo `fs` (File System).
- **`fs.readFile(...)`**: Inicia la lectura de un archivo. No detiene la ejecución del resto del código.
- **Callback `(err, text) => { ... }`**: Es una función que se pasará a `readFile` y que Node.js ejecutará **cuando la lectura del archivo haya terminado**.
- **Flujo asíncrono**: Verás que el mensaje "Haciendo otras cosas..." aparece en la consola *antes* de que se muestre el contenido de los archivos. Esto demuestra la naturaleza no bloqueante de Node.js, ideal para operaciones de entrada/salida (I/O) como leer archivos o hacer peticiones de red.

---

## Lección 4: Módulo FS - Promesas (`04-fs-promises`)

### Código
```javascript

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
```

### Explicación
Muestra una forma más moderna de manejar la asincronía: las **Promesas**.
- **`require('node:fs/promises')`**: Importamos la versión del módulo `fs` que utiliza Promesas en lugar de callbacks.
- **`.then(text => { ... })`**: Este bloque se ejecuta si la promesa se resuelve con éxito (el archivo se leyó correctamente).
- **`.catch(err => { ... })`**: Este bloque se ejecuta si la promesa es rechazada (hubo un error al leer el archivo).
- **Ventaja**: Las promesas permiten un código más limpio y legible que los callbacks anidados (conocido como "callback hell").

---

## Lección 5: Módulo FS - Async/Await (`05-fs-async-await`)

### Código
```javascript
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
```

### Explicación
Presenta la sintaxis **Async/Await**, que es "azúcar sintáctico" sobre las Promesas para escribir código asíncrono que parece síncrono.
- **`async () => { ... }`**: La palabra clave `async` declara una función asíncrona, que permite el uso de `await` dentro de ella.
- **`await readFile(...)`**: La palabra clave `await` pausa la ejecución de la función `async` hasta que la promesa de `readFile` se resuelva. El valor resuelto (el contenido del archivo) se asigna a la variable `text`.
- **`try...catch`**: Es la forma estándar de manejar errores en código que usa `await`. Si la promesa es rechazada, el control salta al bloque `catch`.
- **IIFE**: Usamos una Expresión de Función Invocada Inmediatamente para poder usar `await` en el nivel superior del script.

---

## Lección 6: CRUD de Archivos (`06-fs-crud`)

### Código
```javascript
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
```

### Explicación
Demuestra las operaciones básicas de un **CRUD** (Create, Read, Update, Delete) aplicadas a archivos en el sistema.
- **`fs.readFile`**: Leer (Read).
- **`fs.writeFile`**: Crear (Create). Si el archivo ya existe, lo sobrescribe.
- **`fs.appendFile`**: Actualizar (Update), añadiendo contenido al final del archivo.
- **`fs.rename`**: Actualizar (Update), cambiando el nombre del archivo.
- **`fs.unlink`**: Eliminar (Delete).

---

## Lección 7: Módulo Path (`07-path-module`)

### Código
```javascript
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
```

### Explicación
Introduce el módulo `path`, una utilidad esencial para trabajar con rutas de archivos y directorios de forma segura y compatible entre diferentes sistemas operativos (Windows, macOS, Linux).
- **`path.join(...)`**: Construye una ruta uniendo segmentos. Automáticamente usa el separador correcto (`\` en Windows, `/` en otros). Es la forma recomendada de crear rutas.
- **`path.basename(...)`**: Extrae la parte final de una ruta (el nombre del archivo con su extensión).
- **`path.extname(...)`**: Extrae la extensión de un archivo.
- **`path.resolve(...)`**: Convierte una ruta relativa en una ruta absoluta.

---

## Lección 8: Servidor HTTP Básico (`08-http-server`)

### Código
```javascript
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
```

### Explicación
Creamos nuestro primer servidor web usando el módulo `http`.
- **`http.createServer(...)`**: Crea una instancia de un servidor. Recibe un callback que se ejecutará por cada petición (request) que llegue.
- **`req` (Request)**: Un objeto que contiene toda la información de la petición del cliente (URL, método, cabeceras, etc.).
- **`res` (Response)**: Un objeto que usamos para enviar la respuesta de vuelta al cliente.
- **`res.writeHead(statusCode, headers)`**: Escribe las cabeceras de la respuesta, incluyendo el código de estado (200 para OK, 404 para No Encontrado) y el tipo de contenido.
- **`res.end(data)`**: Finaliza la respuesta, enviando el contenido (en este caso, HTML).
- **`server.listen(port, callback)`**: Pone al servidor a "escuchar" peticiones en un puerto específico.

---

## Lección 9: Servidor de Archivos Estáticos (`09-static-files`)

### Código
```javascript
//  http = require('node:http') // server = http.createServer(async (req, res) =>
//    if (filePath === '/')

const http = require('node:http');
const fs = require('node:fs/promises');
const path = require('node:path');

// Mapa de tipos MIME para las extensiones de archivo
const MIME_TYPES = {
    '.html': 'text/html',
    '.css': 'text/css',
    '.js': 'application/javascript',
    '.json': 'application/json',
    '.png': 'image/png',
    '.jpg': 'image/jpeg',
    '.gif': 'image/gif',
    '.svg': 'image/svg+xml',
    '.ico': 'image/x-icon',
};

const server = http.createServer(async (req, res) => {
    // Normalizamos la URL para que siempre empiece con / y no tenga query params
    const url = new URL(req.url, `http://${req.headers.host}`);
    let filePath = url.pathname;

    // Si la URL es la raíz, servimos index.html
    if (filePath === '/') {
        filePath = '/index.html';
    }

    // Construimos la ruta absoluta al archivo estático
    // __dirname es la ruta del directorio actual del script
    const absolutePath = path.join(__dirname, filePath);

    try {
        // Leemos el archivo
        const data = await fs.readFile(absolutePath);

        // Obtenemos la extensión del archivo
        const ext = path.extname(absolutePath);

        // Obtenemos el tipo MIME, si no lo encontramos, usamos un tipo genérico
        const contentType = MIME_TYPES[ext] || 'application/octet-stream';

        // Establecemos las cabeceras de la respuesta
        res.setHeader('Content-Type', `${contentType}; charset=utf-8`);
        res.statusCode = 200; // OK
        res.end(data);

    } catch (error) {
        // Si el archivo no se encuentra, enviamos un 404
        if (error.code === 'ENOENT') {
            res.statusCode = 404;
            res.setHeader('Content-Type', 'text/html; charset=utf-8');
            res.end('<h1>404 - Archivo no encontrado</h1>');
        } else {
            // Para otros errores, enviamos un 500
            res.statusCode = 500;
            res.setHeader('Content-Type', 'text/html; charset=utf-8');
            res.end('<h1>500 - Error interno del servidor</h1>');
            console.error('Error al servir archivo:', error);
        }
    }
});

server.listen(3000, () => {
    console.log('Servidor de archivos estáticos escuchando en http://localhost:3000');
});
```

### Explicación
Ampliamos el servidor anterior para que pueda servir archivos (HTML, CSS, JS) desde el disco.
- **Lógica principal**: Se determina la ruta del archivo solicitado a partir de la URL de la petición.
- **`path.extname` y `MIME_TYPES`**: Se usa la extensión del archivo para determinar el `Content-Type` correcto. Esto es crucial para que el navegador sepa cómo interpretar el archivo (como HTML, CSS, una imagen, etc.).
- **`fs.readFile`**: Se lee el contenido del archivo de forma asíncrona.
- **Manejo de errores**:
    - **404**: Si `fs.readFile` falla con el código `ENOENT`, significa que el archivo no existe, y enviamos un error 404.
    - **500**: Para cualquier otro error, enviamos un 500 (Error Interno del Servidor).

---

## Lección 10: Express Básico (`10-express-basic`)

### Código
```javascript
// npm init -y (packetes node_modules, package.json)
// npm install express
// express = require('express')
// app.get('/', (req, res) => {res.send (<></>)})
// app.get('/contact', (req, res) => {res.send (<></>)})
// Middleware para manejar rutas no encontradas (404)
// Middleware : app.use((req, res) => {res.send (<></>)})

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
```

### Explicación
Introduce **Express.js**, el framework web más popular para Node.js, que simplifica enormemente la creación de servidores.
- **`const app = express()`**: Crea una aplicación de Express.
- **`app.get(ruta, callback)`**: Define una ruta que responde a peticiones HTTP con el método `GET`. Es mucho más declarativo y limpio que usar `if/else` con `req.url`.
- **`res.send(...)`**: Un método de Express que simplifica el envío de respuestas. Automáticamente establece el `Content-Type` a `text/html` para strings de HTML.
- **`res.status(404)`**: Establece el código de estado de la respuesta. Se puede encadenar con `.send()`.
- **`app.use(...)`**: Se usa para definir "middleware", que veremos en la siguiente lección. Aquí, lo usamos como un manejador "catch-all" para las peticiones que no coinciden con ninguna ruta, devolviendo un 404.

---

## Lección 11: Express Middleware (`11-express-middleware`)

### Código
```javascript
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
```

### Explicación
Profundiza en el concepto más poderoso de Express: el **Middleware**. Son funciones que se ejecutan en secuencia para cada petición.
- **`app.use((req, res, next) => { ... })`**: Define un middleware.
- **`next()`**: Es la función clave. Cuando se llama, pasa el control al siguiente middleware en la cadena. Si no se llama, la petición se detiene.
- **Orden de ejecución**: El orden en que se definen los middleware es crucial.
    1.  **Logging**: Se ejecuta primero para registrar todas las peticiones.
    2.  **`express.json()`**: Un middleware incorporado que parsea el cuerpo de las peticiones JSON y lo pone disponible en `req.body`.
    3.  **`express.static('public')`**: Otro middleware incorporado. Si la petición coincide con un archivo en la carpeta `public`, lo sirve y termina el ciclo (no llama a `next()`)
    4.  **Rutas (`app.post`, `app.get`)**: Son como middleware que solo se ejecutan si el método y la ruta coinciden.
    5.  **Middleware 404**: Se coloca al final. Solo se alcanza si ninguna de las rutas o middleware anteriores ha enviado una respuesta.

---

### Lección 12: Construyendo una API REST con Express.js

#### ¿Qué es una API REST?
Una API (Application Programming Interface) REST (Representational State Transfer) es un conjunto de principios arquitectónicos para construir servicios web. Permite que diferentes sistemas se comuniquen entre sí utilizando operaciones HTTP estándar (GET, POST, PUT, DELETE) para manipular recursos. En este caso, nuestros recursos son "tareas" (tasks).

#### Conceptos Clave:
- **Recursos**: En una API REST, todo es un recurso. Aquí, `tasks` es nuestro recurso principal.
- **Verbos HTTP**: Utilizamos los métodos HTTP para realizar operaciones sobre los recursos:
    - `GET`: Obtener recursos.
    - `POST`: Crear nuevos recursos.
    - `PUT`: Actualizar recursos existentes.
    - `DELETE`: Eliminar recursos.
- **URLs (Endpoints)**: Cada recurso se identifica mediante una URL única (endpoint). Por ejemplo, `/tasks` para todas las tareas o `/tasks/:id` para una tarea específica.
- **JSON**: Es el formato de datos más común para el intercambio de información en APIs REST debido a su ligereza y facilidad de lectura/escritura.

#### `app.js` - Implementación de la API REST

Este archivo implementa una API REST simple para gestionar una lista de tareas. Utiliza Express.js para definir las rutas y el middleware `express.json()` para parsear los cuerpos de las peticiones en formato JSON.

```javascript
const express = require('express');
const app = express();
const port = 3000;

// Middleware para parsear el cuerpo de las peticiones a JSON
// Es crucial para que nuestro servidor entienda los datos que enviamos en peticiones POST y PUT.
app.use(express.json());

// Simulación de una base de datos en memoria.
// En una aplicación real, esto estaría en una base de datos como MongoDB, PostgreSQL, etc.
let tasks = [
  { id: 1, description: 'Aprender Node.js', completed: false },
  { id: 2, description: 'Crear una API REST', completed: false },
  { id: 3, description: 'Conquistar el mundo', completed: false }
];

// --- Definición de Endpoints (Rutas de la API) ---

// 1. GET /tasks - Obtener todas las tareas
app.get('/tasks', (req, res) => {
  res.json(tasks);
});

// 2. GET /tasks/:id - Obtener una tarea por su ID
// :id es un "parámetro de ruta". Express lo captura y lo pone en req.params.
app.get('/tasks/:id', (req, res) => {
  const taskId = parseInt(req.params.id);
  const task = tasks.find(t => t.id === taskId);

  if (task) {
    res.json(task);
  } else {
    res.status(404).json({ message: 'Tarea no encontrada' });
  }
});

// 3. POST /tasks - Crear una nueva tarea
app.post('/tasks', (req, res) => {
  // El middleware express.json() ya ha parseado el cuerpo de la petición en req.body
  const newTask = {
    id: tasks.length > 0 ? Math.max(...tasks.map(t => t.id)) + 1 : 1, // Genera un nuevo ID
    description: req.body.description,
    completed: req.body.completed || false
  };

  if (!newTask.description) {
    return res.status(400).json({ message: 'La descripción es requerida' });
  }

  tasks.push(newTask);
  res.status(201).json(newTask); // 201 Created es el código estándar para creación exitosa
});

// 4. PUT /tasks/:id - Actualizar una tarea existente
app.put('/tasks/:id', (req, res) => {
  const taskId = parseInt(req.params.id);
  const taskIndex = tasks.findIndex(t => t.id === taskId);

  if (taskIndex !== -1) {
    const updatedTask = { ...tasks[taskIndex], ...req.body };
    tasks[taskIndex] = updatedTask;
    res.json(updatedTask);
  } else {
    res.status(404).json({ message: 'Tarea no encontrada' });
  }
});

// 5. DELETE /tasks/:id - Eliminar una tarea
app.delete('/tasks/:id', (req, res) => {
  const taskId = parseInt(req.params.id);
  const taskIndex = tasks.findIndex(t => t.id === taskId);

  if (taskIndex !== -1) {
    tasks = tasks.filter(t => t.id !== taskId);
    res.status(204).send(); // 204 No Content es el código estándar para eliminación exitosa
  } else {
    res.status(404).json({ message: 'Tarea no encontrada' });
  }
});


// Middleware para manejar rutas no encontradas (404)
app.use((req, res) => {
  res.status(404).send('<h1>404 - Ruta no encontrada</h1>');
});


// Iniciar el servidor
app.listen(port, () => {
  console.log(`Servidor API REST escuchando en http://localhost:${port}`);
});
```

---

### Lección 13: API REST con Persistencia de Datos (SQLite)

#### Introducción a la Persistencia de Datos
Hasta ahora, nuestra API REST de tareas almacenaba los datos en un array en memoria. Esto significa que cada vez que el servidor se reiniciaba, todos los datos se perdían. Para que los datos sean permanentes, necesitamos una **base de datos**.

En esta lección, integramos **SQLite**, una base de datos ligera y basada en archivos, ideal para aplicaciones pequeñas o para desarrollo local, ya que no requiere un servidor de base de datos separado.

#### `app.js` - Integración con SQLite

El archivo `app.js` ha sido modificado para:
1.  **Conectar a SQLite**: Al iniciar el servidor, se conecta a un archivo `database.sqlite`. Si no existe, lo crea.
2.  **Crear la tabla `tasks`**: Define un esquema para la tabla `tasks` con `id`, `description` y `completed`. Si la tabla ya existe, no hace nada.
3.  **Operaciones CRUD con SQLite**: Todas las operaciones (GET, POST, PUT, DELETE) ahora interactúan directamente con la base de datos SQLite utilizando sentencias SQL.

```javascript
const express = require('express');
const sqlite3 = require('sqlite3').verbose(); // .verbose() provides more detailed stack traces
const app = express();
const port = 3000;

// Middleware para parsear el cuerpo de las peticiones a JSON
app.use(express.json());

// Conectar a la base de datos SQLite
// Si el archivo de la base de datos no existe, se creará.
const db = new sqlite3.Database('./database.sqlite', (err) => {
  if (err) {
    console.error('Error al conectar a la base de datos:', err.message);
  } else {
    console.log('Conectado a la base de datos SQLite.');
    // Crear la tabla 'tasks' si no existe
    db.run(`CREATE TABLE IF NOT EXISTS tasks (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      description TEXT NOT NULL,
      completed BOOLEAN DEFAULT 0
    )`, (err) => {
      if (err) {
        console.error('Error al crear la tabla tasks:', err.message);
      } else {
        console.log('Tabla tasks creada o ya existente.');
        // Opcional: Insertar algunas tareas de ejemplo si la tabla está vacía
        db.get("SELECT COUNT(*) AS count FROM tasks", (err, row) => {
          if (err) {
            console.error('Error al contar tareas:', err.message);
            return;
          }
          if (row.count === 0) {
            db.run(`INSERT INTO tasks (description, completed) VALUES (?, ?)`, ['Aprender Node.js con SQLite', 0]);
            db.run(`INSERT INTO tasks (description, completed) VALUES (?, ?)`, ['Construir una API REST persistente', 0]);
            console.log('Tareas de ejemplo insertadas.');
          }
        });
      }
    });
  }
});

// --- Definición de Endpoints (Rutas de la API) ---

// 1. GET /tasks - Obtener todas las tareas
app.get('/tasks', (req, res) => {
  db.all("SELECT * FROM tasks", [], (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json(rows);
  });
});

// 2. GET /tasks/:id - Obtener una tarea por su ID
app.get('/tasks/:id', (req, res) => {
  const id = req.params.id;
  db.get("SELECT * FROM tasks WHERE id = ?", [id], (err, row) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    if (row) {
      res.json(row);
    } else {
      res.status(404).json({ message: 'Tarea no encontrada' });
    }
  });
});

// 3. POST /tasks - Crear una nueva tarea
app.post('/tasks', (req, res) => {
  const { description, completed } = req.body;
  if (!description) {
    return res.status(400).json({ message: 'La descripción es requerida' });
  }
  db.run(`INSERT INTO tasks (description, completed) VALUES (?, ?)`, [description, completed || 0], function(err) {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.status(201).json({ id: this.lastID, description, completed: completed || 0 });
  });
});

// 4. PUT /tasks/:id - Actualizar una tarea existente
app.put('/tasks/:id', (req, res) => {
  const id = req.params.id;
  const { description, completed } = req.body;
  db.run(
    `UPDATE tasks SET description = COALESCE(?,description), completed = COALESCE(?,completed) WHERE id = ?`,
    [description, completed, id],
    function(err) {
      if (err) {
        res.status(500).json({ error: err.message });
        return;
      }
      if (this.changes > 0) {
        // Opcional: Devolver la tarea actualizada
        db.get("SELECT * FROM tasks WHERE id = ?", [id], (err, row) => {
          if (err) {
            res.status(500).json({ error: err.message });
            return;
          }
          res.json(row);
        });
      } else {
        res.status(404).json({ message: 'Tarea no encontrada' });
      }
    }
  );
});

// 5. DELETE /tasks/:id - Eliminar una tarea
app.delete('/tasks/:id', (req, res) => {
  const id = req.params.id;
  db.run(`DELETE FROM tasks WHERE id = ?`, id, function(err) {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    if (this.changes > 0) {
      res.status(204).send(); // 204 No Content
    } else {
      res.status(404).json({ message: 'Tarea no encontrada' });
    }
  });
});

// Middleware para manejar rutas no encontradas (404)
app.use((req, res) => {
  res.status(404).send('<h1>404 - Ruta no encontrada</h1>');
});

// Iniciar el servidor
app.listen(port, () => {
  console.log(`Servidor API REST con SQLite escuchando en http://localhost:${port}`);
});

```

---

### Lección 14: Autenticación y Autorización en API REST (JWT)

#### Introducción a la Seguridad en APIs
En una API REST, es fundamental controlar quién puede acceder a qué recursos y qué acciones puede realizar. Esto se logra mediante la **autenticación** (verificar la identidad del usuario) y la **autorización** (determinar los permisos del usuario).

En esta lección, implementamos un sistema de autenticación basado en **JSON Web Tokens (JWT)**, que es un método popular y eficiente para la seguridad de APIs sin estado.

#### Conceptos Clave:
-   **`bcryptjs`**: Una librería para hashear contraseñas. Es crucial no almacenar contraseñas en texto plano en la base de datos por motivos de seguridad. `bcryptjs` convierte la contraseña en una cadena de caracteres ilegible (hash) que no se puede revertir.
-   **JSON Web Tokens (JWT)**: Son tokens compactos y seguros que se utilizan para transmitir información entre las partes como un objeto JSON. Un JWT se compone de tres partes:
    -   **Header**: Tipo de token y algoritmo de firma.
    -   **Payload**: Contiene las "claims" (declaraciones) sobre el usuario y metadatos adicionales.
    -   **Signature**: Una firma criptográfica para verificar que el token no ha sido alterado.
-   **Middleware de Autenticación**: Una función de Express que se ejecuta antes de las rutas protegidas para verificar la validez del JWT.

#### `app.js` - Implementación de Autenticación

El archivo `app.js` ha sido modificado para:
1.  **Importar `bcrypt` y `jsonwebtoken`**.
2.  **Crear la tabla `users`**: Almacena `username` (único) y `password` (hasheada).
3.  **Ruta `POST /register`**:
    *   Recibe `username` y `password`.
    *   Hashea la contraseña usando `bcrypt.hash()`.
    *   Guarda el `username` y la contraseña hasheada en la tabla `users`.
4.  **Ruta `POST /login`**:
    *   Recibe `username` y `password`.
    *   Busca el usuario en la base de datos.
    *   Compara la contraseña proporcionada con la contraseña hasheada almacenada usando `bcrypt.compare()`.
    *   Si las credenciales son válidas, genera un JWT usando `jwt.sign()` con el ID y nombre de usuario del usuario, y lo envía de vuelta al cliente.
5.  **Middleware `authenticateToken`**:
    *   Extrae el token del encabezado `Authorization` (formato `Bearer TOKEN`).
    *   Verifica el token usando `jwt.verify()` con la clave secreta.
    *   Si el token es válido, adjunta la información del usuario (`req.user`) y llama a `next()`.
    *   Si el token es inválido o no proporcionado, envía respuestas de error (401 o 403).
6.  **Protección de Rutas de Tareas**: Se aplica el middleware `authenticateToken` a todas las rutas de `/tasks` usando `app.use('/tasks', authenticateToken);`. Esto significa que cualquier petición a `/tasks` (GET, POST, PUT, DELETE) requerirá un JWT válido.

```javascript
require('dotenv').config();
const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const app = express();
const port = 3000;

// Clave secreta para firmar los JWTs (¡En producción, esto debe ser una variable de entorno segura!)
const JWT_SECRET = process.env.JWT_SECRET; 

// Middleware para parsear el cuerpo de las peticiones a JSON
app.use(express.json());

// Conectar a la base de datos SQLite
const db = new sqlite3.Database('./database.sqlite', (err) => {
  if (err) {
    console.error('Error al conectar a la base de datos:', err.message);
  } else {
    console.log('Conectado a la base de datos SQLite.');
    // Crear la tabla 'tasks' si no existe
    db.run(`CREATE TABLE IF NOT EXISTS tasks (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      description TEXT NOT NULL,
      completed BOOLEAN DEFAULT 0
    )`, (err) => {
      if (err) {
        console.error('Error al crear la tabla tasks:', err.message);
      } else {
        console.log('Tabla tasks creada o ya existente.');
        // Opcional: Insertar algunas tareas de ejemplo si la tabla está vacía
        db.get("SELECT COUNT(*) AS count FROM tasks", (err, row) => {
          if (err) { return console.error('Error al contar tareas:', err.message); }
          if (row.count === 0) {
            db.run(`INSERT INTO tasks (description, completed) VALUES (?, ?)`, ['Aprender Node.js con Auth', 0]);
            db.run(`INSERT INTO tasks (description, completed) VALUES (?, ?)`, ['Proteger API REST', 0]);
            console.log('Tareas de ejemplo insertadas.');
          }
        });
      }
    });

    // Crear la tabla 'users' si no existe
    db.run(`CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT UNIQUE NOT NULL,
      password TEXT NOT NULL
    )`, (err) => {
      if (err) {
        console.error('Error al crear la tabla users:', err.message);
      } else {
        console.log('Tabla users creada o ya existente.');
      }
    });
  }
});

// --- Middleware de Autenticación ---
function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

  if (token == null) return res.status(401).json({ message: 'Token no proporcionado' });

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ message: 'Token inválido o expirado' });
    req.user = user; // Adjunta la información del usuario al objeto de petición
    next(); // Pasa al siguiente middleware/ruta
  });
}

// --- Rutas de Autenticación ---

// Ruta de Registro de Usuario
app.post('/register', async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(400).json({ message: 'Usuario y contraseña son requeridos' });
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10); // Hashear la contraseña
    db.run(`INSERT INTO users (username, password) VALUES (?, ?)`, [username, hashedPassword], function(err) {
      if (err) {
        // Si el usuario ya existe (UNIQUE constraint), SQLite devuelve un error
        if (err.message.includes('SQLITE_CONSTRAINT: UNIQUE constraint failed: users.username')) {
          return res.status(409).json({ message: 'El nombre de usuario ya existe' });
        }
        return res.status(500).json({ error: err.message });
      }
      res.status(201).json({ message: 'Usuario registrado exitosamente', userId: this.lastID });
    });
  } catch (error) {
    res.status(500).json({ error: 'Error al hashear la contraseña' });
  }
});

// Ruta de Login de Usuario
app.post('/login', (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(400).json({ message: 'Usuario y contraseña son requeridos' });
  }

  db.get(`SELECT * FROM users WHERE username = ?`, [username], async (err, user) => {
    if (err) { return res.status(500).json({ error: err.message }); }
    if (!user) { return res.status(400).json({ message: 'Credenciales inválidas' }); }

    try {
      const isMatch = await bcrypt.compare(password, user.password); // Comparar contraseña
      if (!isMatch) { return res.status(400).json({ message: 'Credenciales inválidas' }); }

      // Generar JWT
      const token = jwt.sign({ id: user.id, username: user.username }, JWT_SECRET, { expiresIn: '1h' });
      res.json({ message: 'Login exitoso', token });
    } catch (error) {
      res.status(500).json({ error: 'Error al comparar contraseña' });
    }
  });
});

// --- Rutas de la API de Tareas (PROTEGIDAS) ---

// Aplica el middleware de autenticación a todas las rutas de tareas
app.use('/tasks', authenticateToken);

// 1. GET /tasks - Obtener todas las tareas
app.get('/tasks', (req, res) => {
  db.all("SELECT * FROM tasks", [], (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json(rows);
  });
});

// 2. GET /tasks/:id - Obtener una tarea por su ID
app.get('/tasks/:id', (req, res) => {
  const id = req.params.id;
  db.get("SELECT * FROM tasks WHERE id = ?", [id], (err, row) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    if (row) {
      res.json(row);
    } else {
      res.status(404).json({ message: 'Tarea no encontrada' });
    }
  });
});

// 3. POST /tasks - Crear una nueva tarea
app.post('/tasks', (req, res) => {
  const { description, completed } = req.body;
  if (!description) {
    return res.status(400).json({ message: 'La descripción es requerida' });
  }
  db.run(`INSERT INTO tasks (description, completed) VALUES (?, ?)`, [description, completed || 0], function(err) {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.status(201).json({ id: this.lastID, description, completed: completed || 0 });
  });
});

// 4. PUT /tasks/:id - Actualizar una tarea existente
app.put('/tasks/:id', (req, res) => {
  const id = req.params.id;
  const { description, completed } = req.body;
  db.run(
    `UPDATE tasks SET description = COALESCE(?,description), completed = COALESCE(?,completed) WHERE id = ?`,
    [description, completed, id],
    function(err) {
      if (err) {
        res.status(500).json({ error: err.message });
        return;
      }
      if (this.changes > 0) {
        db.get("SELECT * FROM tasks WHERE id = ?", [id], (err, row) => {
          if (err) { return res.status(500).json({ error: err.message }); }
          res.json(row);
        });
      } else {
        res.status(404).json({ message: 'Tarea no encontrada' });
      }
    }
  );
});

// 5. DELETE /tasks/:id - Eliminar una tarea
app.delete('/tasks/:id', (req, res) => {
  const id = req.params.id;
  db.run(`DELETE FROM tasks WHERE id = ?`, id, function(err) {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    if (this.changes > 0) {
      res.status(204).send(); // 204 No Content
    } else {
      res.status(404).json({ message: 'Tarea no encontrada' });
    }
  });
});

// Middleware para manejar rutas no encontradas (404)
app.use((req, res) => {
  res.status(404).send('<h1>404 - Ruta no encontrada</h1>');
});

// Iniciar el servidor
app.listen(port, () => {
  console.log(`Servidor API REST con Autenticación escuchando en http://localhost:${port}`);
});
```