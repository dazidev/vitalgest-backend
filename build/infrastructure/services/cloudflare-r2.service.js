"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.r2 = void 0;
exports.deleteByKey = deleteByKey;
exports.deleteMany = deleteMany;
const client_s3_1 = require("@aws-sdk/client-s3");
const dotenv_1 = require("dotenv");
(0, dotenv_1.config)();
exports.r2 = new client_s3_1.S3Client({
    region: "auto",
    endpoint: `https://${process.env.CF_ACCOUNT_ID}.r2.cloudflarestorage.com`,
    credentials: {
        accessKeyId: process.env.R2_ACCESS_KEY_ID,
        secretAccessKey: process.env.R2_SECRET_ACCESS_KEY,
    },
    forcePathStyle: true,
});
// 1) Borrar por bucket + key
async function deleteByKey(bucket, key) {
    await exports.r2.send(new client_s3_1.DeleteObjectCommand({ Bucket: bucket, Key: key }));
}
// 2) Borrar varios a la vez
async function deleteMany(bucket, keys) {
    if (!keys.length)
        return;
    await exports.r2.send(new client_s3_1.DeleteObjectsCommand({
        Bucket: bucket,
        Delete: { Objects: keys.map(Key => ({ Key })) }
    }));
}
