frontend/js/app.js

let draggedId = null;

const showToast = (msg, type = 'success') => {
  const container = document.getElementById('toast-container');
  const id = 'toast-' + Date.now();
  container.innerHTML += `
    <div id="${id}" class="toast align-items-center text-bg-${type} border-0 show" role="alert">
      <div class="d-flex">
        <div class="toast-body">${msg}</div>
        <button type="button" class="btn-close btn-close-white me-2 m-auto" onclick="document.getElementById('${id}').remove()"></button>
      </div>
    </div>`;
  setTimeout(() => { const el = document.getElementById(id); if (el) el.remove(); }, 3500);
};

const renderTasks = (tasks) => {
  ['todo', 'doing', 'done'].forEach(status => {
    const list = document.getElementById(`list-${status}`);
    list.innerHTML = '';
    tasks.filter(t => t.status === status).forEach(task => {
      const card = document.createElement('div');
      card.className = 'task-card';
      card.draggable = true;
      card.dataset.id = task.id;
      card.innerHTML = `
        <div class="d-flex justify-content-between align-items-start">
          <strong>${escapeHtml(task.title)}</strong>
          <button class="btn btn-sm btn-outline-danger ms-2" onclick="eliminarTarea('${task.id}')">🗑</button>
        </div>
        ${task.description ? `<p class="text-muted small mt-1 mb-0">${escapeHtml(task.description)}</p>` : ''}
        <small class="text-muted">${new Date(task.createdAt).toLocaleDateString()}</small>
      `;
      card.addEventListener('dragstart', () => { draggedId = task.id; card.classList.add('dragging'); });
      card.addEventListener('dragend', () => card.classList.remove('dragging'));
      list.appendChild(card);
    });
  });
};

const escapeHtml = (str) => str.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');

const cargarTareas = async () => {
  try {
    const tasks = await api.getAll();
    renderTasks(tasks);
  } catch (err) {
    showToast('No se pudo conectar con el servidor', 'danger');
  }
};
const crearTarea = async () => {

  const title = document.getElementById('input-title').value.trim();
  const description = document.getElementById('input-desc').value.trim();
  const status = document.getElementById('input-status').value;

  if (!title) {
    showToast('El título es requerido', 'warning');
    return;
  }

  // Validación extra
  if (title.length < 3) {
    showToast('El título debe tener al menos 3 caracteres', 'warning');
    return;

  try {
    await api.create({ title, description, status });
    bootstrap.Modal.getInstance(document.getElementById('modalCrear')).hide();
    document.getElementById('input-title').value = '';
    document.getElementById('input-desc').value = '';
    showToast('Tarea creada exitosamente');
    await cargarTareas();
  } catch (err) {
    showToast(err.message, 'danger');
  }
};

}
const eliminarTarea = async (id) => {
  if (!confirm('¿Eliminar esta tarea?')) return;
  try {
    await api.remove(id);
    showToast('Tarea eliminada', 'secondary');
    await cargarTareas();
  } catch (err) {
    showToast(err.message, 'danger');
  }
};

const onDrop = async (event, newStatus) => {
  event.preventDefault();
  if (!draggedId) return;
  try {
    await api.update(draggedId, { status: newStatus });
    draggedId = null;
    await cargarTareas();
  } catch (err) {
    showToast(err.message, 'danger');
  }
};

document.addEventListener('DOMContentLoaded', cargarTareas);