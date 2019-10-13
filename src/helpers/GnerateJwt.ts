import { sign } from 'jsonwebtoken';
import { JWTSECRET } from '../config/Secrets'

export async function generateJwtToken(args: any) {
    return await sign(args, JWTSECRET, { expiresIn: '60d' });
}