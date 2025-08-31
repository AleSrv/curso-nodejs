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
