// src/infrastructure/files/file.helpers.ts
// Helper autosuficiente para guardar File (Web API) en disco.
// Compatible con distintas versiones de undici (sin usar export nombrado).

import { promises as fs } from 'fs';
import path from 'path';
import { randomUUID } from 'crypto';
import * as undici from 'undici'; // namespace import

// Usa el File global o el de undici
const WebFile: typeof File | undefined =
  (globalThis as any).File ?? (undici as any).File;

// --- Configuración de extensiones por MIME ---
const MIME_EXT: Record<string, string> = {
  'image/jpeg': 'jpg',
  'image/png': 'png',
  'image/webp': 'webp',
  'application/pdf': 'pdf',
};

// --- Utils ---
function sanitizeName(name: string) {
  const base = path.basename(name || 'file').replace(/\s+/g, '-');
  return base.replace(/[^a-zA-Z0-9._-]/g, '');
}

function getExt(file: File): string {
  const byMime = MIME_EXT[file.type];
  if (byMime) return byMime;

  const fromName = path.extname(file.name).replace('.', '');
  return fromName || 'bin';
}

async function ensureDir(dir: string) {
  await fs.mkdir(dir, { recursive: true });
}

// --- API ---
/**
 * Guarda un File (Web API) en disco, creando las carpetas necesarias.
 *
 * @param file   Archivo Web (instancia de File)
 * @param baseDir Carpeta base (por defecto 'uploads')
 * @param subDir  Subcarpeta lógica (p. ej. 'YYYY-MM/<ambulanceId>'); si no se indica, usa 'YYYY-MM'
 *
 * @returns { relPath, absPath, size, mime, filename }
 */
export async function saveWebFile(
  file: File,
  baseDir = 'uploads',
  subDir?: string
): Promise<{ relPath: string; absPath: string; size: number; mime: string; filename: string }> {
  if (!WebFile) {
    throw new Error('File API no disponible. Usa Node >= 18 o undici con File.');
  }
  if (!(file instanceof WebFile)) {
    throw new Error('INVALID_FILE_OBJECT');
  }

  // 1) Crea carpeta base uploads/
  const absBase = path.resolve(baseDir);
  await ensureDir(absBase);

  // 2) Crea subcarpeta
  const now = new Date();
  const defaultSub = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
  const relSub = subDir ?? defaultSub;

  const absDir = path.join(absBase, relSub);
  const relDir = path.join(baseDir, relSub);
  await ensureDir(absDir);

  // 3) Nombre único
  const ext = getExt(file);
  const safeOriginal = sanitizeName(file.name || `file.${ext}`);
  const uuid = randomUUID();
  const hasExt = path.extname(safeOriginal).toLowerCase() === `.${ext.toLowerCase()}`;
  const filename = hasExt ? `${uuid}-${safeOriginal}` : `${uuid}-${safeOriginal}.${ext}`;

  // 4) Escribir archivo
  const buffer = Buffer.from(await file.arrayBuffer());
  const absPath = path.join(absDir, filename);
  const relPath = path.join(relDir, filename);

  try {
    await fs.writeFile(absPath, buffer, { flag: 'wx' });
  } catch (e: any) {
    if (e?.code !== 'EEXIST') throw e;
    // Reintento raro si colisiona el nombre
    const retryName = `${randomUUID()}-${safeOriginal}${hasExt ? '' : `.${ext}`}`;
    const retryAbs = path.join(absDir, retryName);
    const retryRel = path.join(relDir, retryName);
    await fs.writeFile(retryAbs, buffer, { flag: 'wx' });
    return { relPath: retryRel, absPath: retryAbs, size: buffer.length, mime: file.type, filename: retryName };
  }

  return { relPath, absPath, size: buffer.length, mime: file.type, filename };
}

/**
 * Convierte un archivo de multer (memoria) a File Web compatible con este helper.
 */
export function toWebFile(mf?: Express.Multer.File): File | undefined {
  if (!mf) return undefined;
  if (!WebFile) {
    throw new Error('File API no disponible. Usa Node >= 18 o undici con File.');
  }

  // Crea un Uint8Array NUEVO (con ArrayBuffer normal) y copia el Buffer de multer
  const part = new Uint8Array(mf.buffer.length);
  part.set(mf.buffer); // <- copia los bytes, evita ArrayBufferLike/SharedArrayBuffer

  return new WebFile([part], mf.originalname, { type: mf.mimetype }) as File;
}




/**
 * (Opcional) Crea la carpeta raíz de uploads al iniciar la app.
 */
export async function ensureUploadsRoot(baseDir = 'uploads') {
  const absBase = path.resolve(baseDir);
  await ensureDir(absBase);
  return absBase;
}



