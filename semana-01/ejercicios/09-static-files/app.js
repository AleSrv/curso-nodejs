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
