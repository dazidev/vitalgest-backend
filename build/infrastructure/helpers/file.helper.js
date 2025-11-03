"use strict";
// src/infrastructure/files/file.helpers.ts
// Helper autosuficiente para guardar File (Web API) en disco.
// Compatible con distintas versiones de undici (sin usar export nombrado).
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.saveWebFile = saveWebFile;
exports.toWebFile = toWebFile;
exports.relToAbs = relToAbs;
exports.absToRel = absToRel;
exports.ensureUploadsRoot = ensureUploadsRoot;
const fs_1 = require("fs");
const path_1 = __importDefault(require("path"));
const crypto_1 = require("crypto");
const undici = __importStar(require("undici")); // namespace import
// Usa el File global o el de undici
const WebFile = globalThis.File ?? undici.File;
// --- Configuración de extensiones por MIME ---
const MIME_EXT = {
    'image/jpeg': 'jpg',
    'image/png': 'png',
    'image/webp': 'webp',
    'application/pdf': 'pdf',
};
// --- Utils ---
function sanitizeName(name) {
    const base = path_1.default.basename(name || 'file').replace(/\s+/g, '-');
    return base.replace(/[^a-zA-Z0-9._-]/g, '');
}
function getExt(file) {
    const byMime = MIME_EXT[file.type];
    if (byMime)
        return byMime;
    const fromName = path_1.default.extname(file.name).replace('.', '');
    return fromName || 'bin';
}
async function ensureDir(dir) {
    await fs_1.promises.mkdir(dir, { recursive: true });
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
async function saveWebFile(file, baseDir = 'uploads', subDir) {
    if (!WebFile) {
        throw new Error('File API no disponible. Usa Node >= 18 o undici con File.');
    }
    if (!(file instanceof WebFile)) {
        throw new Error('INVALID_FILE_OBJECT');
    }
    // 1) Crea carpeta base uploads/
    const absBase = path_1.default.resolve(baseDir);
    await ensureDir(absBase);
    // 2) Crea subcarpeta
    const now = new Date();
    const defaultSub = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
    const relSub = subDir ?? defaultSub;
    const absDir = path_1.default.join(absBase, relSub);
    const relDir = path_1.default.join(baseDir, relSub);
    await ensureDir(absDir);
    // 3) Nombre único
    const ext = getExt(file);
    const safeOriginal = sanitizeName(file.name || `file.${ext}`);
    const uuid = (0, crypto_1.randomUUID)();
    const hasExt = path_1.default.extname(safeOriginal).toLowerCase() === `.${ext.toLowerCase()}`;
    const filename = hasExt ? `${uuid}-${safeOriginal}` : `${uuid}-${safeOriginal}.${ext}`;
    // 4) Escribir archivo
    const buffer = Buffer.from(await file.arrayBuffer());
    const absPath = path_1.default.join(absDir, filename);
    const relPath = path_1.default.join(relDir, filename);
    try {
        await fs_1.promises.writeFile(absPath, buffer, { flag: 'wx' });
    }
    catch (e) {
        if (e?.code !== 'EEXIST')
            throw e;
        // Reintento raro si colisiona el nombre
        const retryName = `${(0, crypto_1.randomUUID)()}-${safeOriginal}${hasExt ? '' : `.${ext}`}`;
        const retryAbs = path_1.default.join(absDir, retryName);
        const retryRel = path_1.default.join(relDir, retryName);
        await fs_1.promises.writeFile(retryAbs, buffer, { flag: 'wx' });
        return { relPath: retryRel, absPath: retryAbs, size: buffer.length, mime: file.type, filename: retryName };
    }
    return { relPath, absPath, size: buffer.length, mime: file.type, filename };
}
/**
 * Convierte un archivo de multer (memoria) a File Web compatible con este helper.
 */
function toWebFile(mf) {
    if (!mf)
        return undefined;
    if (!WebFile) {
        throw new Error('File API no disponible. Usa Node >= 18 o undici con File.');
    }
    // Crea un Uint8Array NUEVO (con ArrayBuffer normal) y copia el Buffer de multer
    const part = new Uint8Array(mf.buffer.length);
    part.set(mf.buffer);
    return new WebFile([part], mf.originalname, { type: mf.mimetype });
}
const ABS_UPLOADS_ROOT = path_1.default.resolve('uploads');
function relToAbs(relPath) {
    const normalized = relPath.replace(/\\/g, '/');
    const withoutPrefix = normalized.replace(/^uploads\//, '');
    const abs = path_1.default.resolve(ABS_UPLOADS_ROOT, withoutPrefix);
    if (!abs.startsWith(ABS_UPLOADS_ROOT + path_1.default.sep)) {
        throw new Error('INVALID_PATH_TRAVERSAL');
    }
    return abs;
}
function absToRel(absPath) {
    const relFromRoot = path_1.default.relative(ABS_UPLOADS_ROOT, absPath).split(path_1.default.sep).join('/');
    return `uploads/${relFromRoot}`; // mismo formato que guardas en DB
}
/**
 * (Opcional) Crea la carpeta raíz de uploads al iniciar la app.
 */
async function ensureUploadsRoot(baseDir = 'uploads') {
    const absBase = path_1.default.resolve(baseDir);
    await ensureDir(absBase);
    return absBase;
}
