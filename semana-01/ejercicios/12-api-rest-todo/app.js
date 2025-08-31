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