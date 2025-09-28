import { parse as uuidParse, stringify as uuidStringify } from 'uuid';

export const uuidToBin = (uuidStr: string): Buffer =>
  Buffer.from(uuidParse(uuidStr));

export const binToUuid = (buf: Buffer): string =>
  uuidStringify(buf);

