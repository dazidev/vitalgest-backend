
import { promises as fs } from 'fs'
import path from 'path'
import { randomUUID } from 'crypto'
import * as undici from 'undici'


const WebFile: typeof File | undefined =
  (globalThis as any).File ?? (undici as any).File

const MIME_EXT: Record<string, string> = {
  'image/jpeg': 'jpg',
  'image/png': 'png',
  'image/webp': 'webp',
  'application/pdf': 'pdf',
}

function sanitizeName(name: string) {
  const base = path.basename(name || 'file').replace(/\s+/g, '-')
  return base.replace(/[^a-zA-Z0-9._-]/g, '')
}

function getExt(file: File): string {
  const byMime = MIME_EXT[file.type]
  if (byMime) return byMime

  const fromName = path.extname(file.name).replace('.', '')
  return fromName || 'bin'
}

async function ensureDir(dir: string) {
  await fs.mkdir(dir, { recursive: true })
}

export async function saveWebFile(
  file: File,
  baseDir = 'uploads',
  subDir?: string
): Promise<{ relPath: string; absPath: string; size: number; mime: string; filename: string }> {
  if (!WebFile) {
    throw new Error('File API no disponible. Usa Node >= 18 o undici con File.')
  }
  if (!(file instanceof WebFile)) {
    throw new Error('INVALID_FILE_OBJECT')
  }

  //* crea la carpeta
  const absBase = path.resolve(baseDir)
  await ensureDir(absBase)

  //* crea subcarpeta
  const now = new Date()
  const defaultSub = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`
  const relSub = subDir ?? defaultSub

  const absDir = path.join(absBase, relSub)
  const relDir = path.join(baseDir, relSub)
  await ensureDir(absDir)

  //* genera nombre unico
  const ext = getExt(file)
  const safeOriginal = sanitizeName(file.name || `file.${ext}`)
  const uuid = randomUUID()
  const hasExt = path.extname(safeOriginal).toLowerCase() === `.${ext.toLowerCase()}`
  const filename = hasExt ? `${uuid}-${safeOriginal}` : `${uuid}-${safeOriginal}.${ext}`

  //* conf para escribir el archivo
  const buffer = Buffer.from(await file.arrayBuffer())
  const absPath = path.join(absDir, filename)
  const relPath = path.join(relDir, filename)

  try {
    await fs.writeFile(absPath, buffer, { flag: 'wx' })
  } catch (e: any) {
    if (e?.code !== 'EEXIST') throw e
    //* reintento raro si colisiona el nombre
    const retryName = `${randomUUID()}-${safeOriginal}${hasExt ? '' : `.${ext}`}`
    const retryAbs = path.join(absDir, retryName)
    const retryRel = path.join(relDir, retryName)
    await fs.writeFile(retryAbs, buffer, { flag: 'wx' })
    return { relPath: retryRel, absPath: retryAbs, size: buffer.length, mime: file.type, filename: retryName }
  }

  return { relPath, absPath, size: buffer.length, mime: file.type, filename }
}

//*Convierte un archivo de multer (memoria) a File Web compatible con este helper
export function toWebFile(mf?: Express.Multer.File): File | undefined {
  if (!mf) return undefined
  if (!WebFile) {
    throw new Error('File API no disponible. Usa Node >= 18 o undici con File.')
  }
  const part = new Uint8Array(mf.buffer.length)
  part.set(mf.buffer)

  return new WebFile([part], mf.originalname, { type: mf.mimetype }) as File
}

const ABS_UPLOADS_ROOT = path.resolve('uploads')

export function relToAbs(relPath: string): string {
  const normalized = relPath.replace(/\\/g, '/');
  const withoutPrefix = normalized.replace(/^uploads\//, '')

  const abs = path.resolve(ABS_UPLOADS_ROOT, withoutPrefix)

  if (!abs.startsWith(ABS_UPLOADS_ROOT + path.sep)) {
    throw new Error('INVALID_PATH_TRAVERSAL')
  }
  return abs;
}

export function absToRel(absPath: string): string {
  const relFromRoot = path.relative(ABS_UPLOADS_ROOT, absPath).split(path.sep).join('/')
  return `uploads/${relFromRoot}`
}

//* crea la carpeta raíz de uploads al iniciar el api
export async function ensureUploadsRoot(baseDir = 'uploads') {
  const absBase = path.resolve(baseDir)
  await ensureDir(absBase)
  return absBase
}



