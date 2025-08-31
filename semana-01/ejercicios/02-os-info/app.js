// require('os');
//os.platform // os.release // os.arch // os.cpus().length 
//os.freemem() //  os.totalmem // os.uptime
const os = require('os');

console.log('Información del sistema operativo:');
console.log('-----------------------------------');

console.log('Nombre del sistema operativo:', os.platform());
console.log('Versión del sistema operativo:', os.release());
console.log('Arquitectura:', os.arch());
console.log('CPUs:', os.cpus().length);
console.log('Memoria libre (MB):', os.freemem() / 1024 / 1024);
console.log('Memoria total (MB):', os.totalmem() / 1024 / 1024);
console.log('Tiempo encendido (horas):', os.uptime() / 60 / 60);
