# Semana 1: Introducción a Node.js

¡Bienvenido a la primera semana! Aquí sentaremos las bases de Node.js.

## Teoría

- **¿Qué es Node.js?**: Un entorno de ejecución para JavaScript construido con el motor V8 de Chrome. Nos permite ejecutar JavaScript en el servidor.
- **Historia y ventajas**: Creado por Ryan Dahl en 2009. Es asíncrono, no bloqueante y está orientado a eventos, lo que lo hace ideal para aplicaciones en tiempo real y APIs.
- **Instalación**: Se recomienda usar un gestor de versiones como `nvm` (Node Version Manager) o `fnm` (Fast Node Manager) para poder cambiar fácilmente entre versiones de Node.js.
- **Tu primer "Hola Mundo"**: El clásico `console.log('Hola, Mundo');` guardado en un archivo `app.js` y ejecutado con `node app.js`.
- **`package.json` y `npm`**: `npm` es el gestor de paquetes de Node. `package.json` es el corazón de cualquier proyecto de Node; define sus propiedades, scripts y dependencias. Se crea con `npm init -y`.
- **CommonJS vs ESModules**: Dos sistemas de módulos. CommonJS (`require`/`module.exports`) es el clásico de Node. ESModules (`import`/`export`) es el estándar moderno de JavaScript.
- **`nodemon`**: Una herramienta que reinicia automáticamente nuestra aplicación cuando detecta cambios en los archivos. Se instala con `npm install nodemon -D` y se usa en la sección de scripts de `package.json`.

## Ejercicios y Proyecto

### 1. CLI de Reloj

- **Objetivo**: Crear un script que muestre la hora actual cada segundo en la terminal.
- **Pistas**: Usa `setInterval` y el objeto `new Date()`.
- **Ubicación**: `ejercicios/01-reloj-cli/`

### 2. Módulo de Matemáticas

- **Objetivo**: Crear un módulo personalizado con funciones para sumar, restar, multiplicar y dividir. Luego, importa y usa ese módulo desde otro archivo.
- **Pistas**: Usa `module.exports` para exportar las funciones.
- **Ubicación**: `ejercicios/02-modulo-matematicas/`

### Proyecto: Saludo Interactivo

- **Objetivo**: Crear una mini aplicación de terminal que salude al usuario por su nombre (obtenido de los argumentos de la línea de comandos) y muestre la fecha y hora actual.
- **Requisitos**:
  - Debe usar `process.argv` para leer el nombre del usuario.
  - Debe usar un módulo local para formatear la fecha/hora.
  - Debe tener un `package.json` con un script para ejecutar la app con `nodemon`.
- **Ubicación**: `proyecto/`
