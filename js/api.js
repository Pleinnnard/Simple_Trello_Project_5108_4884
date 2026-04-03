const API_URL = 'http://localhost:3000/tasks';

const api = {

  getAll: async () => {
    try {
      const res = await fetch(API_URL);
      if (!res.ok) throw new Error('Error al obtener tareas');
      return await res.json();
    } catch (err) {
      throw new Error('Servidor no disponible');
    }
  },

  create: async (data) => {
    try {
      const res = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });

      const json = await res.json();

      if (!res.ok) throw new Error(json.error || 'Error al crear tarea');

      return json;
    } catch (err) {
      throw err;
    }
  },

  update: async (id, data) => {
    const res = await fetch(`${API_URL}/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });

    const json = await res.json();

    if (!res.ok) throw new Error(json.error || 'Error al actualizar tarea');

    return json;
  },

  remove: async (id) => {
    const res = await fetch(`${API_URL}/${id}`, { method: 'DELETE' });

    if (!res.ok) throw new Error('Error al eliminar tarea');

    return res.json();
  }
};