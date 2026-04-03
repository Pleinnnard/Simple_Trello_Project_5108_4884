const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '../data/task.json');

const getAll = () => {
    try {
    if (!fs.existsSync(filePath)) return [];
    const data = fs.readFileSync(filePath, 'utf-8');
    return JSON.parse(data);
    } catch (err) {
    throw new Error('Error al leer el archivo de datos');
    }
};

const save = (tasks) => {
    try {
    fs.writeFileSync(filePath, JSON.stringify(tasks, null, 2), 'utf-8');
    } catch (err) {
        throw new Error('Error al guardar el archivo de datos');
    }
};

module.exports = { getAll, save };
