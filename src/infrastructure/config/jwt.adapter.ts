import jwt, {JwtPayload, TokenExpiredError} from 'jsonwebtoken'
import { config } from 'dotenv';

type VerifyResult<T> =
  | { success: true; payload: T & JwtPayload }
  | { success: false; reason: "expired" | "invalid" };

config()
  
const ACCESS_SECRET = process.env.JWT_SECRET!
const REFRESH_SECRET = process.env.JWT_REFRESH_SECRET!

export class JwtAdapter {
  static generateToken = (payload: object, duration: string = '2h', type: 'ACCESS' | 'REFRESH'): Promise<string | null> => {
    return new Promise((resolve) => {
      const options = { expiresIn: duration } as jwt.SignOptions
      const newPayload = {...payload, type}
      jwt.sign(newPayload, type === 'ACCESS' ? ACCESS_SECRET : REFRESH_SECRET, options,
        (err, token) => {
          if (err || !token) return resolve(null)
          resolve(token)
        }
      )
    })
  }
  static validateAccessToken<T extends object = JwtPayload>(token: string): Promise<VerifyResult<T>> {
    return new Promise((resolve) => {
      jwt.verify(
        token, 
        ACCESS_SECRET, 
        (err, decoded) => {
          if (err) {
            if (err instanceof TokenExpiredError) {
              return resolve({ success: false, reason: "expired" })
            }
            return resolve({ success: false, reason: "invalid" })
          }
          return resolve({ success: true, payload: decoded as T & JwtPayload })
        }
      )
    })
  }
  static validateRefreshToken<T extends object = JwtPayload>(token: string): Promise<VerifyResult<T>> {
    return new Promise((resolve) => {
      jwt.verify(
        token, 
        REFRESH_SECRET, 
        (err, decoded) => {
          if (err) {
            if (err instanceof TokenExpiredError) {
              return resolve({ success: false, reason: "expired" })
            }
            return resolve({ success: false, reason: "invalid" })
          }
          return resolve({ success: true, payload: decoded as T & JwtPayload })
        }
      )
    })
  }
}

