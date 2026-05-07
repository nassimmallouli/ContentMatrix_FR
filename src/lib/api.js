import { API_BASE } from './config.js';

async function req(path, opts = {}) {
  const res = await fetch(API_BASE + path, {
    headers: { 'Content-Type': 'application/json', ...opts.headers },
    ...opts,
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Request failed');
  return data;
}

export const api = {
  health: () => req('/health'),
  
  // Documents
  listDocs: () => req('/documents'),
  createDoc: (doc) => req('/documents', { method: 'POST', body: JSON.stringify(doc) }),
  updateDoc: (id, updates) => req(`/documents/${id}`, { method: 'PUT', body: JSON.stringify(updates) }),
  deleteDoc: (id) => req(`/documents/${id}`, { method: 'DELETE' }),

  // File upload
  uploadFile: async (file) => {
    const form = new FormData();
    form.append('file', file);
    const res = await fetch(API_BASE + '/upload', { method: 'POST', body: form });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Upload failed');
    return data;
  },
};
