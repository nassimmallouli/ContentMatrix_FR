import { useState, useEffect, useCallback } from 'react';
import { api } from '../lib/api.js';

export function useDocuments() {
  const [docs, setDocs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [synced, setSynced] = useState(false);
  const [error, setError] = useState(null);

  const fetchAll = useCallback(async () => {
    try {
      setLoading(true);
      const data = await api.listDocs();
      setDocs(data);
      setSynced(true);
      setError(null);
    } catch (e) {
      setError(e.message);
      setSynced(false);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchAll(); }, [fetchAll]);

  const createDoc = useCallback(async (doc) => {
    const created = await api.createDoc(doc);
    setDocs(prev => [created, ...prev]);
    return created;
  }, []);

  const updateDoc = useCallback(async (id, updates) => {
    const updated = await api.updateDoc(id, updates);
    setDocs(prev => prev.map(d => d.id === id ? updated : d));
    return updated;
  }, []);

  const deleteDoc = useCallback(async (id) => {
    await api.deleteDoc(id);
    setDocs(prev => prev.filter(d => d.id !== id));
  }, []);

  return { docs, loading, synced, error, fetchAll, createDoc, updateDoc, deleteDoc };
}
