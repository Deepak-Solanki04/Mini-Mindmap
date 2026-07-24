import { v4 as uuidv4 } from 'uuid';
import { Mindmap, StoredMindmap } from './types';

const db = new Map<string, StoredMindmap>();

export const saveMindmap = (mindmap: Mindmap): StoredMindmap => {
  const id = uuidv4();
  
  const stored: StoredMindmap = {
    id,
    ...mindmap,
    createdAt: new Date().toISOString()
  };

  db.set(id, stored);
  return stored;
};

export const getMindmapsList = () => {
  const all = Array.from(db.values());
  all.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  
  return all.map(m => ({
    id: m.id,
    title: m.title,
    createdAt: m.createdAt
  }));
};

export const getMindmapById = (id: string): StoredMindmap | null => {
  return db.get(id) || null;
};

export const clearDatabaseForTests = () => {
  if (process.env.NODE_ENV === 'test') {
    db.clear();
  }
};
