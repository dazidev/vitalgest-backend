import { DeleteObjectCommand, DeleteObjectsCommand, S3Client } from "@aws-sdk/client-s3"

import {config} from 'dotenv'

config()

export const r2 = new S3Client({
  region: "auto",
  endpoint: `https://${process.env.CF_ACCOUNT_ID}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId: process.env.R2_ACCESS_KEY_ID!,
    secretAccessKey: process.env.R2_SECRET_ACCESS_KEY!,
  },
  forcePathStyle: true,
})

// 1) Borrar por bucket + key
export async function deleteByKey(bucket: string, key: string) {
  await r2.send(new DeleteObjectCommand({ Bucket: bucket, Key: key }));
}

// 2) Borrar varios a la vez
export async function deleteMany(bucket: string, keys: string[]) {
  if (!keys.length) return;
  await r2.send(new DeleteObjectsCommand({
    Bucket: bucket,
    Delete: { Objects: keys.map(Key => ({ Key })) }
  }));
}