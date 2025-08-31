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