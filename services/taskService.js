const taskRepository = require('../repository/taskRepository');

const VALID_STATUSES = ['todo', 'doing', 'done'];

const getAll = () => taskRepository.getAll();

const create = ({ title, description, status }) => {
    const tasks = taskRepository.getAll();
    const duplicate = tasks.find(t => t.title.toLowerCase() === title.toLowerCase());
    if (duplicate) throw new Error('DUPLICATE');

    const newTask = {
    id: Date.now().toString(),
    title,
    description,
    status: VALID_STATUSES.includes(status) ? status : 'todo',
    createdAt: new Date().toISOString()
    };

    tasks.push(newTask);
    taskRepository.save(tasks);
    return newTask;
};

const update = (id, data) => {
    const tasks = taskRepository.getAll();
    const index = tasks.findIndex(t => t.id === id);
    if (index === -1) throw new Error('NOT_FOUND');

    if (data.status && !VALID_STATUSES.includes(data.status)) {
    data.status = tasks[index].status;
    }

    tasks[index] = { ...tasks[index], ...data };
    taskRepository.save(tasks);
    return tasks[index];
};

const remove = (id) => {
    const tasks = taskRepository.getAll();
    const index = tasks.findIndex(t => t.id === id);
    if (index === -1) throw new Error('NOT_FOUND');

    tasks.splice(index, 1);
    taskRepository.save(tasks);
};

module.exports = { getAll, create, update, remove };