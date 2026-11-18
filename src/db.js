import * as SQLite from 'expo-sqlite';

let dbPromise = null;

function db() {
  if (!dbPromise) {
    dbPromise = (async () => {
      const d = await SQLite.openDatabaseAsync('fotoapuntes.db');
      await d.execAsync(`CREATE TABLE IF NOT EXISTS historial (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        fecha TEXT NOT NULL,
        titulo TEXT NOT NULL,
        json TEXT NOT NULL
      );`);
      return d;
    })();
  }
  return dbPromise;
}

export async function guardar(analisis) {
  const d = await db();
  await d.runAsync('INSERT INTO historial (fecha, titulo, json) VALUES (?, ?, ?)', [
    new Date().toISOString(),
    analisis.titulo,
    JSON.stringify(analisis),
  ]);
}

export async function listar() {
  const d = await db();
  return d.getAllAsync('SELECT * FROM historial ORDER BY id DESC');
}

export async function borrar(id) {
  const d = await db();
  await d.runAsync('DELETE FROM historial WHERE id = ?', [id]);
}
