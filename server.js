const express = require('express');
const cors = require('cors');
const path = require('path');
const taskRoutes = require('./routes/taskRoutes');

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname)));

app.use('/tasks', taskRoutes);

app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
