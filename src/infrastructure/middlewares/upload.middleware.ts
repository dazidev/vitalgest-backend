import multer from "multer";
import { CustomError } from "../../application";
import { ERROR_CODES } from "../../domain";

export const ALLOWED_MIME = new Set([
  "image/jpeg",
  "image/png",
  "application/pdf",
]);

export const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
  fileFilter: (_req, file, cb) => {
    if (!ALLOWED_MIME.has(file.mimetype)) {
      return cb(CustomError.badRequest(ERROR_CODES.INVALID_FILES_TYPE));
    }
    cb(null, true);
  },
});

export const checklistGasFile = upload.fields([
  { name: "gasFile", maxCount: 1 },
]);

export const checklistSignFiles = upload.fields([
  { name: "signOperatorFile", maxCount: 1 },
  { name: "signRecipientFile", maxCount: 1 },
]);
